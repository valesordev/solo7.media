// Decide the [PROPOSED P<n>] marks Brian checked on a merged visual-designer PR (S7M-INF-010).
// usage: node scripts/decide-proposals.mjs <pr> [--summary <file>]
// The convention is the "Proposal IDs" paragraph in brands/valesordev/brand/foundation.md (S7M-VAL-019).
// Run it from a checkout of the PR's merge commit (the workflow does); it refuses if a file it would
// rewrite has changed since the merge, and writes nothing unless every check passes.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const CHECKBOX = /^- \[([ xX])\] P([1-9]\d*): \S.*$/;
const PROPOSED = /\[PROPOSED P([1-9]\d*)\]/g;
const BRAND_MD = /^brands\/([^/]+)\/.+\.md$/;

export const proposedMark = (id) => `[PROPOSED P${id}]`;
export const decidedMark = (date, pr, id) => `[DECIDED ${date}, PR #${pr}, P${id}]`;

// A brand has adopted the convention when a paragraph of its foundation.md opens "Proposal IDs".
export const isAdopted = (foundation) => /(^|\n[ \t]*\n)Proposal IDs\b/.test(foundation.replace(/\r\n/g, '\n'));

// The PR body's checkbox lines: checked and unchecked IDs, and an error for an ID listed twice.
export function parseCheckboxes(body) {
  const checked = new Set();
  const unchecked = new Set();
  const errors = [];
  for (const line of (body ?? '').split(/\r?\n/)) {
    const m = CHECKBOX.exec(line);
    if (!m) continue;
    const id = Number(m[2]);
    if (checked.has(id) || unchecked.has(id)) errors.push(`P${id} has more than one checkbox line in the PR body`);
    (m[1] === ' ' ? unchecked : checked).add(id);
  }
  return { checked, unchecked, errors };
}

// Added line numbers (in the new file) per path, from `git diff --unified=0`. `diff --git` opens a file
// header and `@@` a hunk; inside a hunk every line is content, so an added "++ x" (`+++ x`) is not a header.
export function addedLines(diff) {
  const added = new Map();
  let path = null;
  let inHunk = false;
  let line = 0;
  for (const l of diff.split('\n')) {
    if (l.startsWith('diff --git ')) { path = null; inHunk = false; continue; }
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(l);
    if (hunk) { inHunk = true; line = Number(hunk[1]); continue; }
    if (!inHunk) {
      if (!l.startsWith('+++ ')) continue;
      const target = l.slice(4);
      if (target.startsWith('"')) throw new Error(`quoted path in diff, not supported: ${target}`);
      path = target === '/dev/null' ? null : target.replace(/^b\//, '');
      if (path) added.set(path, added.get(path) ?? new Set());
      continue;
    }
    if (!path) continue;
    if (l.startsWith('+')) added.get(path).add(line++);
    else if (l.startsWith(' ')) line++;
  }
  return added;
}

// The pure decision. files: [{ path, text, added: Set<line> }] for the adopted brands' .md files the PR changed.
// Returns the decided and left IDs, any errors, and (only when there are no errors) the rewritten files.
export function decide({ pr, state, mergedAt, body, files }) {
  const errors = [];
  if (state !== 'MERGED' || !mergedAt) errors.push(`PR #${pr} is not merged`);
  const { checked, unchecked, errors: boxErrors } = parseCheckboxes(body);
  errors.push(...boxErrors);
  const date = mergedAt ? new Date(mergedAt).toISOString().slice(0, 10) : '';

  const marks = [];
  for (const f of files) {
    f.text.split('\n').forEach((text, i) => {
      if (!f.added.has(i + 1)) return;
      for (const m of text.matchAll(PROPOSED)) marks.push({ id: Number(m[1]), path: f.path, line: i + 1 });
    });
  }
  const where = (ms) => ms.map((m) => `${m.path}:${m.line}`).join(', ');

  const decided = [];
  for (const id of [...checked].sort((a, b) => a - b)) {
    const at = marks.filter((m) => m.id === id);
    if (at.length === 0) errors.push(`P${id} is checked, but no ${proposedMark(id)} is on a line PR #${pr} added`);
    else if (at.length > 1) errors.push(`P${id} is checked and appears ${at.length} times on lines PR #${pr} added: ${where(at)}`);
    else decided.push(at[0]);
  }
  const left = [];
  for (const id of [...new Set([...marks.map((m) => m.id), ...unchecked])].sort((a, b) => a - b)) {
    if (checked.has(id)) continue;
    left.push({ id, reason: unchecked.has(id) ? 'unchecked' : 'no checkbox', at: where(marks.filter((m) => m.id === id)) });
  }
  if (errors.length) return { date, decided, left, errors, outputs: new Map() };

  const outputs = new Map();
  for (const f of files) {
    const mine = decided.filter((d) => d.path === f.path);
    if (!mine.length) continue;
    const lines = f.text.split('\n');
    for (const d of mine) lines[d.line - 1] = lines[d.line - 1].replace(proposedMark(d.id), decidedMark(date, pr, d.id));
    outputs.set(f.path, lines.join('\n'));
  }
  const bad = selfCheck(files, outputs, decided, date, pr);
  if (bad.length) return { date, decided, left, errors: bad, outputs: new Map() };
  return { date, decided, left, errors, outputs };
}

// AC5: apart from the mark substitutions, every rewritten file is byte-identical to its input.
export function selfCheck(files, outputs, decided, date, pr) {
  const errors = [];
  for (const [path, out] of outputs) {
    const before = files.find((f) => f.path === path).text.split('\n');
    const after = out.split('\n');
    // Line → the IDs decided on it (a table row can carry more than one).
    const subs = new Map();
    for (const d of decided.filter((x) => x.path === path)) subs.set(d.line, [...(subs.get(d.line) ?? []), d.id]);
    if (before.length !== after.length) { errors.push(`self-check: ${path} changed line count`); continue; }
    after.forEach((a, i) => {
      const ids = subs.get(i + 1) ?? [];
      // Each decided mark appears exactly once on its line, and putting every one back gives the input line.
      const once = ids.every((id) => a.split(decidedMark(date, pr, id)).length === 2);
      const restored = ids.reduce((s, id) => s.replace(decidedMark(date, pr, id), proposedMark(id)), a);
      if (!once || restored !== before[i]) errors.push(`self-check: ${path}:${i + 1} differs beyond the mark`);
    });
  }
  return errors;
}

const git = (...args) => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 64 << 20 });

function main(argv) {
  const [prArg, ...rest] = argv;
  const summaryAt = rest[0] === '--summary' ? rest[1] : undefined;
  if (!/^[0-9]+$/.test(prArg ?? '') || (rest.length && !summaryAt)) {
    console.error('usage: decide-proposals.mjs <pr-number> [--summary <file>]');
    return 2;
  }
  const pr = Number(prArg);
  const view = JSON.parse(execFileSync('gh', ['pr', 'view', String(pr), '--json', 'state,mergedAt,body,mergeCommit'], { encoding: 'utf8' }));
  const sha = view.mergeCommit?.oid;
  if (view.state !== 'MERGED' || !sha) {
    console.error(`PR #${pr} is not merged; nothing written`);
    return 1;
  }
  try { git('cat-file', '-e', `${sha}^1^{commit}`); } catch {
    console.error(`merge commit ${sha} or its first parent isn't in this clone; fetch it (the workflow checks out with fetch-depth: 2)`);
    return 1;
  }

  const adopted = new Map();
  const isBrandAdopted = (slug) => {
    if (!adopted.has(slug)) {
      let text = '';
      try { text = git('show', `${sha}:brands/${slug}/brand/foundation.md`); } catch { /* no foundation.md: not adopted */ }
      adopted.set(slug, isAdopted(text));
    }
    return adopted.get(slug);
  };
  const files = [];
  const errors = [];
  for (const [path, added] of addedLines(git('diff', '--no-color', '--no-ext-diff', '--unified=0', '--src-prefix=a/', '--dst-prefix=b/', `${sha}^1`, sha, '--', 'brands/'))) {
    const m = BRAND_MD.exec(path);
    if (!m || !added.size || !isBrandAdopted(m[1])) continue;
    const text = git('show', `${sha}:${path}`);
    let current = null;
    try { current = readFileSync(path, 'utf8'); } catch { /* missing */ }
    if (current !== text) errors.push(`${path} differs from the merge commit ${sha.slice(0, 7)}; run from a checkout of it`);
    files.push({ path, text, added });
  }

  const result = decide({ pr, state: view.state, mergedAt: view.mergedAt, body: view.body, files });
  result.errors.unshift(...errors);
  for (const d of result.decided) console.log(`decided P${d.id} (${d.path}:${d.line})`);
  for (const l of result.left) console.log(`left P${l.id}: ${l.reason}${l.at ? ` (${l.at})` : ''}`);
  if (result.errors.length) {
    for (const e of result.errors) console.error(e);
    console.error('nothing written');
    return 1;
  }
  for (const [path, out] of result.outputs) writeFileSync(path, out);
  if (!result.decided.length && !result.left.length) console.log(`no proposal IDs on PR #${pr}; nothing to decide`);
  if (summaryAt) {
    writeFileSync(summaryAt, JSON.stringify({
      pr, mergeSha: sha, date: result.date,
      decided: result.decided.map((d) => d.id), left: result.left.map(({ id, reason }) => ({ id, reason })),
      files: [...result.outputs.keys()],
    }, null, 2) + '\n');
  }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
