// `make test-scripts`: publish-decided-proposals against a fake gh on PATH (node:test, offline; nothing reaches GitHub).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { commentBody } from './publish-decided-proposals.mjs';

const SCRIPT = resolve(dirname(new URL(import.meta.url).pathname), 'publish-decided-proposals.mjs');
const MERGE = 'a'.repeat(40);
let dir;

before(() => {
  dir = mkdtempSync(join(tmpdir(), 'publish-proposals-'));
  // Each call is logged as one JSON line {args, stdin}. FAKE_REF empty: the branch doesn't exist (404).
  writeFileSync(join(dir, 'gh'), `#!/usr/bin/env bash
stdin=""; [ "$2" = graphql ] && stdin=$(cat)
S="$stdin" node -e 'require("fs").appendFileSync(process.env.FAKE_LOG, JSON.stringify({args: process.argv.slice(1), stdin: process.env.S}) + "\\n")' -- "$@"
case "$2" in
  repos/o/r/git/ref/heads/*) [ -n "$FAKE_REF" ] || { echo "HTTP 404" >&2; exit 1; }; echo "{\\"object\\":{\\"sha\\":\\"$FAKE_REF\\"}}";;
  repos/o/r/git/commits/*) echo "{\\"parents\\":[{\\"sha\\":\\"$FAKE_PARENT\\"}]}";;
  repos/o/r/contents/*) echo "{\\"encoding\\":\\"base64\\",\\"content\\":\\"$FAKE_CONTENT\\"}";;
  repos/o/r/compare/*) c='[{"filename":"brands/valesordev/brand/usage.md"}]'; echo "{\\"files\\":\${FAKE_COMPARE:-$c}}";;
  "repos/o/r/pulls?head=o:auto/decide-proposals-42&state=all") echo "\${FAKE_PULLS:-[]}";;
  "repos/o/r/pulls?"*) echo "unexpected pulls query: $2" >&2; exit 1;;
  repos/o/r/issues/42/comments) echo "$FAKE_COMMENT";;
  repos/o/r/pulls) echo '{"number":77}';;
  graphql) echo '{"data":{}}';;
  *) echo "";;
esac
`);
  chmodSync(join(dir, 'gh'), 0o755);
  mkdirSync(join(dir, 'brands/valesordev/brand'), { recursive: true });
  writeFileSync(join(dir, 'brands/valesordev/brand/usage.md'), 'New rule. [DECIDED 2026-10-24, PR #42, P2]\n');
});
after(() => rmSync(dir, { recursive: true, force: true }));

const publish = (summary, env = {}) => {
  const log = join(dir, 'log');
  rmSync(log, { force: true });
  writeFileSync(join(dir, 'summary.json'), JSON.stringify({ pr: 42, mergeSha: MERGE, date: '2026-10-24', ...summary }));
  const r = spawnSync('node', [SCRIPT, 'summary.json'], {
    cwd: dir, encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_LOG: log, GITHUB_REPOSITORY: 'o/r', FAKE_REF: '', FAKE_PARENT: '', ...env },
  });
  const calls = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l)) : [];
  return { ...r, calls, paths: calls.map((c) => c.args[1]) };
};

test('nothing decided: no branch, commit or PR; one comment listing what is open', () => {
  const r = publish({ decided: [], left: [{ id: 3, reason: 'unchecked' }], files: [] });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.paths, ['repos/o/r/issues/42/comments', 'repos/o/r/issues/42/comments']);
  const body = r.calls[1].args.find((a) => a.startsWith('body='));
  assert.match(body, /Nothing decided/);
  assert.match(body, /Still open: P3 \(unchecked\)/);
});

test('decided: branch at the merge commit, signed commit through GraphQL, follow-up PR, comment linking it', () => {
  const r = publish({ decided: [2], left: [], files: ['brands/valesordev/brand/usage.md'] });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.calls.some((c) => c.args.includes('push')));
  const ref = r.calls.find((c) => c.args[1] === 'repos/o/r/git/refs');
  assert.deepEqual(ref.args.slice(2), ['-f', 'ref=refs/heads/auto/decide-proposals-42', '-f', `sha=${MERGE}`]);
  const { variables: { input } } = JSON.parse(r.calls.find((c) => c.args[1] === 'graphql').stdin);
  assert.equal(input.expectedHeadOid, MERGE);
  assert.equal(input.branch.branchName, 'auto/decide-proposals-42');
  assert.deepEqual(input.fileChanges.additions.map((a) => [a.path, Buffer.from(a.contents, 'base64').toString()]),
    [['brands/valesordev/brand/usage.md', 'New rule. [DECIDED 2026-10-24, PR #42, P2]\n']]);
  const pr = r.calls.find((c) => c.args[1] === 'repos/o/r/pulls');
  assert.ok(pr.args.includes('title=Decide checked proposals from #42'));
  assert.ok(pr.args.includes('base=main'));
  const prBody = pr.args.find((a) => a.startsWith('body='));
  assert.doesNotMatch(prBody, /Story:/);
  assert.ok(!pr.args.some((a) => a.startsWith('labels')));
  const comment = r.calls.at(-1).args.find((a) => a.startsWith('body='));
  assert.match(comment, /Decided from this PR's checked boxes: P2, in #77/);
});

const LOCAL = 'New rule. [DECIDED 2026-10-24, PR #42, P2]\n';
const b64 = (s) => Buffer.from(s).toString('base64');

test('re-run: the branch already carries the same commit on the merge commit → no second commit, PR opened', () => {
  const r = publish({ decided: [2], left: [], files: ['brands/valesordev/brand/usage.md'] },
    { FAKE_REF: 'b'.repeat(40), FAKE_PARENT: MERGE, FAKE_CONTENT: b64(LOCAL) });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.paths.includes('graphql'));
  assert.ok(!r.paths.includes('repos/o/r/git/refs'));
  assert.ok(r.paths.includes('repos/o/r/pulls'));
});

test('re-run after more boxes were checked: the branch content differs → fails red, no PR, no comment', () => {
  const r = publish({ decided: [1, 2], left: [], files: ['brands/valesordev/brand/usage.md'] },
    { FAKE_REF: 'b'.repeat(40), FAKE_PARENT: MERGE, FAKE_CONTENT: b64('only P1 decided\n') });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /differs from this run/);
  assert.ok(!r.paths.some((p) => p === 'repos/o/r/pulls' || p.includes('/comments')));
});

const pull = (state, decided, merged = false) => JSON.stringify([{ number: 77, state, merged_at: merged ? '2026-10-25T00:00:00Z' : null,
  body: `Decides…\n<!-- decided: ${decided} -->\n` }]);

test('the follow-up PR body records the decided IDs for re-runs', () => {
  const r = publish({ decided: [2, 5], left: [], files: ['brands/valesordev/brand/usage.md'] });
  assert.equal(r.status, 0, r.stderr);
  const body = r.calls.find((c) => c.args[1] === 'repos/o/r/pulls').args.find((a) => a.startsWith('body='));
  assert.match(body, /<!-- decided: 2,5 -->/);
});

test('re-run with the follow-up PR open and the same IDs: reused, no second PR or commit', () => {
  const r = publish({ decided: [2], left: [], files: ['brands/valesordev/brand/usage.md'] },
    { FAKE_REF: 'b'.repeat(40), FAKE_PARENT: MERGE, FAKE_CONTENT: b64(LOCAL), FAKE_PULLS: pull('open', '2') });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.paths.some((p) => p === 'repos/o/r/pulls' || p === 'graphql'));
  assert.match(r.calls.at(-1).args.find((a) => a.startsWith('body=')), /in #77/);
});

test('re-run with an open or merged follow-up that decided other IDs: fails red, no PR, no comment', () => {
  for (const [state, merged] of [['open', false], ['closed', true]]) {
    const r = publish({ decided: [2], left: [{ id: 3, reason: 'unchecked' }], files: ['brands/valesordev/brand/usage.md'] },
      { FAKE_REF: 'b'.repeat(40), FAKE_PARENT: MERGE, FAKE_CONTENT: b64(LOCAL), FAKE_PULLS: pull(state, '2,3', merged) });
    assert.notEqual(r.status, 0, state);
    assert.match(r.stderr, /#77 decided P2, P3; this run decides P2/, state);
    assert.ok(!r.paths.some((p) => p === 'repos/o/r/pulls' || p.includes('/comments')), state);
  }
});

test('re-run whose branch commit changed a file this run does not: fails red', () => {
  const r = publish({ decided: [1], left: [], files: ['brands/valesordev/brand/usage.md'] },
    { FAKE_REF: 'b'.repeat(40), FAKE_PARENT: MERGE, FAKE_CONTENT: b64(LOCAL),
      FAKE_COMPARE: '[{"filename":"brands/valesordev/brand/usage.md"},{"filename":"brands/valesordev/brand/voice.md"}]' });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /changes .*voice\.md/);
  assert.ok(!r.paths.some((p) => p === 'repos/o/r/pulls' || p.includes('/comments')));
});

test('re-run after the follow-up PR merged with the same IDs: no branch, commit or PR; the comment points at it', () => {
  const r = publish({ decided: [2], left: [], files: ['brands/valesordev/brand/usage.md'] },
    { FAKE_PULLS: pull('closed', '2', true) });
  assert.equal(r.status, 0, r.stderr);
  assert.ok(!r.paths.some((p) => p === 'graphql' || p === 'repos/o/r/git/refs' || p === 'repos/o/r/pulls' || p.startsWith('repos/o/r/git/ref/')));
  assert.match(r.calls.at(-1).args.find((a) => a.startsWith('body=')), /in #77/);
});

test('re-run with the comment already there: it is updated, not duplicated', () => {
  const r = publish({ decided: [], left: [], files: [] }, { FAKE_COMMENT: '9' });
  assert.equal(r.status, 0, r.stderr);
  const patch = r.calls.filter((c) => c.args.includes('PATCH'));
  assert.deepEqual(patch.map((c) => c.args[1]), ['repos/o/r/issues/comments/9']);
  assert.equal(r.calls.filter((c) => c.args[1] === 'repos/o/r/issues/42/comments').length, 1);
});

test('a stale branch not built on the merge commit: fails, no PR, no comment', () => {
  const r = publish({ decided: [2], left: [], files: ['brands/valesordev/brand/usage.md'] }, { FAKE_REF: 'b'.repeat(40), FAKE_PARENT: 'c'.repeat(40) });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /not built on the merge commit/);
  assert.ok(!r.paths.some((p) => p === 'repos/o/r/pulls' || p.includes('/comments')));
});

test('commentBody starts with the marker the upsert looks for', () => {
  assert.match(commentBody({ pr: 1, date: 'd', decided: [], left: [] }, null), /^<!-- decide-proposals -->\n/);
});
