// `make test-scripts`: decide-proposals against fixture PR bodies, diffs and brand docs (node:test, offline).
// The end-to-end case runs the CLI in a throwaway git repo with a real merge commit and a fake gh on PATH.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { decide, addedLines, parseCheckboxes, isAdopted, selfCheck } from './decide-proposals.mjs';

const MERGED = { pr: 42, state: 'MERGED', mergedAt: '2026-10-24T23:30:00Z' };
const DECIDED = (id) => `[DECIDED 2026-10-24, PR #42, P${id}]`;
const file = (path, lines, added) => ({ path, text: lines.join('\n'), added: new Set(added) });
const run = (body, files, pr = MERGED) => decide({ ...pr, body, files });

test('checked → decided in the exact form; the date is the merge date in UTC', () => {
  const f = file('brands/valesordev/brand/usage.md', ['# Usage', 'Arrows on actions. [PROPOSED P3]', ''], [2]);
  const r = run('Intro\n- [x] P3: arrows on actions\n', [f]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.outputs.get(f.path), `# Usage\nArrows on actions. ${DECIDED(3)}\n`);
  assert.deepEqual(r.decided.map((d) => d.id), [3]);
  // 23:30 in UTC-7 is the next day in UTC: the UTC date wins.
  assert.equal(run('- [x] P3: a', [f], { ...MERGED, mergedAt: '2026-10-24T23:30:00-07:00' }).date, '2026-10-25');
});

test('a box checked with X decides, same as x; CRLF bodies parse', () => {
  const f = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]', 'B [PROPOSED P2]'], [1, 2]);
  const r = run('- [X] P1: a\r\n- [x] P2: b\r\n', [f]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.outputs.get(f.path), `A ${DECIDED(1)}\nB ${DECIDED(2)}`);
});

test('unchecked and no-checkbox IDs are left, and listed with the reason', () => {
  const f = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]', 'B [PROPOSED P2]', 'C [PROPOSED P4]'], [1, 2, 3]);
  const r = run('- [x] P1: a\n- [ ] P2: b\n', [f]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.outputs.get(f.path), `A ${DECIDED(1)}\nB [PROPOSED P2]\nC [PROPOSED P4]`);
  assert.deepEqual(r.left.map(({ id, reason }) => [id, reason]), [[2, 'unchecked'], [4, 'no checkbox']]);
});

test('a checked ID not on any added line: reported, nothing written', () => {
  const f = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]', 'B [PROPOSED P5]'], [1]);
  const r = run('- [x] P1: a\n- [x] P5: older, not on an added line\n', [f]);
  assert.match(r.errors.join('\n'), /P5 is checked, but no \[PROPOSED P5\] is on a line PR #42 added/);
  assert.equal(r.outputs.size, 0);
});

test('a checked ID that appears twice on added lines: error naming both, nothing written', () => {
  const a = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]'], [1]);
  const b = file('brands/valesordev/brand/voice.md', ['x', 'B [PROPOSED P1]'], [2]);
  const r = run('- [x] P1: a\n', [a, b]);
  assert.match(r.errors.join('\n'), /P1 is checked and appears 2 times .*usage\.md:1, brands\/valesordev\/brand\/voice\.md:2/);
  assert.equal(r.outputs.size, 0);
});

test('the same ID as an older, unchanged mark in a touched file: only the added one is decided', () => {
  const f = file('brands/valesordev/brand/usage.md', ['Old [PROPOSED P7]', 'New [PROPOSED P8]'], [2]);
  const r = run('- [x] P8: new\n', [f]);
  assert.deepEqual(r.errors, []);
  assert.equal(r.outputs.get(f.path), `Old [PROPOSED P7]\nNew ${DECIDED(8)}`);
  assert.deepEqual(r.left, []);
});

test('an unmerged PR: error, nothing written', () => {
  const f = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]'], [1]);
  const r = run('- [x] P1: a\n', [f], { pr: 42, state: 'OPEN', mergedAt: null });
  assert.match(r.errors.join('\n'), /PR #42 is not merged/);
  assert.equal(r.outputs.size, 0);
});

test('an ID with two checkbox lines in the body: error', () => {
  const f = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]'], [1]);
  assert.match(run('- [x] P1: a\n- [ ] P1: again\n', [f]).errors.join('\n'), /P1 has more than one checkbox line/);
});

test('apart from the mark, the output is byte-identical: CRLF, tabs, trailing space, other marks kept', () => {
  const lines = ['# T\r', '\tindent  [PROPOSED P2] tail  \r', 'keep [DECIDED 2026-10-08] and [PROPOSED]\r', ''];
  const f = file('brands/valesordev/brand/usage.md', lines, [2]);
  const r = run('- [x] P2: x\n', [f]);
  assert.deepEqual(r.errors, []);
  const expected = lines.join('\n').replace('[PROPOSED P2]', DECIDED(2));
  assert.equal(Buffer.compare(Buffer.from(r.outputs.get(f.path)), Buffer.from(expected)), 0);
});

test('self-check (AC5): a change beyond the mark is caught', () => {
  const f = file('brands/valesordev/brand/usage.md', ['A [PROPOSED P1]', 'B'], [1]);
  const decided = [{ id: 1, path: f.path, line: 1 }];
  assert.deepEqual(selfCheck([f], new Map([[f.path, `A ${DECIDED(1)}\nB`]]), decided, '2026-10-24', 42), []);
  for (const out of [`A ${DECIDED(1)}\nB!`, `A! ${DECIDED(1)}\nB`, `A ${DECIDED(1)} ${DECIDED(1)}\nB`, `A ${DECIDED(1)}\nB\n`]) {
    assert.notDeepEqual(selfCheck([f], new Map([[f.path, out]]), decided, '2026-10-24', 42), [], out);
  }
});

test('checkbox lines must be exact: not indented, need a summary, P0 is not an ID', () => {
  const { checked, unchecked } = parseCheckboxes(' - [x] P1: indented\n- [x] P2:\n- [x] P0: zero\n- [x] P3 no colon\n* [x] P4: star\n- [x] P5: ok');
  assert.deepEqual([...checked], [5]);
  assert.deepEqual([...unchecked], []);
});

test('adoption: a paragraph opening "Proposal IDs", not the words mid-paragraph', () => {
  assert.ok(isAdopted('# F\n\nProposal IDs (S7M-VAL-019). The words…'));
  assert.ok(isAdopted('Proposal IDs at the top'));
  assert.ok(isAdopted('a\r\n\r\nProposal IDs here'));
  assert.ok(!isAdopted('# F\n\nWe may adopt Proposal IDs later.'));
  assert.ok(!isAdopted('# F\nProposal IDs on the line after a heading, same paragraph'));
});

test('addedLines: new-file line numbers from a --unified=0 diff', () => {
  const diff = [
    'diff --git a/brands/v/brand/usage.md b/brands/v/brand/usage.md',
    '--- a/brands/v/brand/usage.md',
    '+++ b/brands/v/brand/usage.md',
    '@@ -2,0 +3,2 @@ heading',
    '+one',
    '+two',
    '@@ -9 +11 @@',
    '-old',
    '+new',
    'diff --git a/brands/v/gone.md b/brands/v/gone.md',
    '--- a/brands/v/gone.md',
    '+++ /dev/null',
    '@@ -1 +0,0 @@',
    '-bye',
  ].join('\n');
  const added = addedLines(diff);
  assert.deepEqual([...added.get('brands/v/brand/usage.md')], [3, 4, 11]);
  assert.ok(!added.has('brands/v/gone.md'));
});

// End to end: the CLI in a git repo whose main has a real merge commit, with a fake gh answering `pr view`.
const SCRIPT = resolve(dirname(new URL(import.meta.url).pathname), 'decide-proposals.mjs');
const FOUNDATION = '# Valesor\n\nProposal IDs (S7M-VAL-019). Marks are `[PROPOSED P<n>]`.\n';
let repo;
let bin;
const sh = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], { cwd: repo, encoding: 'utf8' });
const put = (p, text) => { mkdirSync(dirname(join(repo, p)), { recursive: true }); writeFileSync(join(repo, p), text); };

before(() => {
  repo = mkdtempSync(join(tmpdir(), 'decide-proposals-'));
  bin = join(repo, '.bin');
  sh('init', '-q', '-b', 'main');
  put('.gitignore', '.bin/\nsummary.json\n');
  put('brands/valesordev/brand/foundation.md', FOUNDATION);
  put('brands/valesordev/brand/usage.md', '# Usage\nOld rule. [PROPOSED P1]\n');
  put('brands/system9studios/brand/foundation.md', '# S9\n');
  sh('add', '-A'); sh('commit', '-qm', 'base');
  sh('switch', '-qc', 'design/x');
  put('brands/valesordev/brand/usage.md', '# Usage\nOld rule. [PROPOSED P1]\nNew rule. [PROPOSED P2]\nMaybe. [PROPOSED P3]\n');
  put('brands/valesordev/tokens/notes.txt', 'not markdown [PROPOSED P2]\n');
  put('brands/system9studios/brand/usage.md', 'unadopted [PROPOSED P2]\n');
  sh('add', '-A'); sh('commit', '-qm', 'proposals');
  sh('switch', '-q', 'main');
  sh('merge', '-q', '--no-ff', '-m', 'Merge pull request #42', 'design/x');
  mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), `#!/usr/bin/env bash\necho "$*" >> "${join(bin, 'log')}"\necho "$FAKE_VIEW"\n`);
  chmodSync(join(bin, 'gh'), 0o755);
});
after(() => rmSync(repo, { recursive: true, force: true }));

const cli = (args, body) => {
  const view = JSON.stringify({ state: 'MERGED', mergedAt: '2026-10-24T18:00:00Z', body, mergeCommit: { oid: sh('rev-parse', 'HEAD').trim() } });
  return spawnSync('node', [SCRIPT, ...args], { cwd: repo, encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, FAKE_VIEW: view } });
};

test('end to end: decides checked IDs on added lines only, writes a summary, leaves everything else', () => {
  const r = cli(['42', '--summary', 'summary.json'], '- [x] P2: new rule\n- [ ] P3: maybe\n');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(readFileSync(join(repo, 'brands/valesordev/brand/usage.md'), 'utf8'),
    '# Usage\nOld rule. [PROPOSED P1]\nNew rule. [DECIDED 2026-10-24, PR #42, P2]\nMaybe. [PROPOSED P3]\n');
  assert.equal(readFileSync(join(repo, 'brands/valesordev/tokens/notes.txt'), 'utf8'), 'not markdown [PROPOSED P2]\n');
  assert.equal(readFileSync(join(repo, 'brands/system9studios/brand/usage.md'), 'utf8'), 'unadopted [PROPOSED P2]\n');
  const s = JSON.parse(readFileSync(join(repo, 'summary.json'), 'utf8'));
  assert.deepEqual([s.decided, s.left, s.files], [[2], [{ id: 3, reason: 'unchecked' }], ['brands/valesordev/brand/usage.md']]);
  assert.match(r.stdout, /decided P2 \(brands\/valesordev\/brand\/usage\.md:3\)/);
  assert.match(r.stdout, /left P3: unchecked/);
  sh('checkout', '-q', '--', '.');
});

test('end to end: a file changed since the merge → refuses, nothing written', () => {
  put('brands/valesordev/brand/usage.md', 'edited after the merge\n');
  const r = cli(['42'], '- [x] P2: new rule\n');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /differs from the merge commit/);
  assert.equal(readFileSync(join(repo, 'brands/valesordev/brand/usage.md'), 'utf8'), 'edited after the merge\n');
  sh('checkout', '-q', '--', '.');
});

test('end to end: a checked ID only on an older line → non-zero, nothing written', () => {
  const r = cli(['42', '--summary', 'none.json'], '- [x] P1: old\n');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /P1 is checked, but no \[PROPOSED P1\] is on a line PR #42 added/);
  assert.equal(sh('status', '--porcelain'), '');
  assert.ok(!existsSync(join(repo, 'none.json')));
});

test('make decide-proposals without PR: usage, non-zero, no gh call', () => {
  rmSync(join(bin, 'log'), { force: true });
  const env = { ...process.env, PATH: `${bin}:${process.env.PATH}` };
  delete env.PR;
  const r = spawnSync('make', ['--no-print-directory', 'decide-proposals'], { encoding: 'utf8', env });
  assert.notEqual(r.status, 0);
  assert.match(r.stdout + r.stderr, /usage: make decide-proposals PR=/);
  assert.ok(!existsSync(join(bin, 'log')));
});
