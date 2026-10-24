// `make test-scripts`: approve-deploy against a fake gh on PATH (node:test, offline; nothing reaches GitHub).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const PREVIEW = { environment: { id: 1, name: 'preview' }, current_user_can_approve: true };
const PRODUCTION = { environment: { id: 2, name: 'production' }, current_user_can_approve: true };

let dir;
before(() => {
  dir = mkdtempSync(join(tmpdir(), 'approve-deploy-'));
  // Logs every call; answers from FAKE_RUN (empty: no waiting run) and FAKE_PENDING; captures the POST body.
  writeFileSync(join(dir, 'gh'), `#!/usr/bin/env bash
echo "gh $*" >> "$FAKE_LOG"
case "$1 $2" in
  "repo view") echo valesordev/solo7.media;;
  "pr view") echo "abc123 Fix the header";;
  "run list") echo "$FAKE_RUN";;
  "api -X") cat > "$FAKE_POST"; echo "preview → https://example.test/statuses";;
  "api "*) echo "$FAKE_PENDING";;
esac
`);
  chmodSync(join(dir, 'gh'), 0o755);
});
after(() => rmSync(dir, { recursive: true, force: true }));

// Runs `make approve-deploy <vars>` with the fake gh; returns status, output, gh calls, and the POST body (or null).
const run = (vars, { pending = [PREVIEW], waitingRun = '999' } = {}) => {
  const log = join(dir, 'log');
  const post = join(dir, 'post');
  rmSync(log, { force: true });
  rmSync(post, { force: true });
  const env = { ...process.env, PATH: `${dir}:${process.env.PATH}`, FAKE_LOG: log, FAKE_POST: post,
    FAKE_RUN: waitingRun, FAKE_PENDING: JSON.stringify(pending) };
  delete env.PR;
  delete env.COMMENT;
  const r = spawnSync('make', ['--no-print-directory', 'approve-deploy', ...vars], { env, encoding: 'utf8' });
  return {
    status: r.status,
    out: r.stdout + r.stderr,
    calls: existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n') : [],
    body: existsSync(post) ? JSON.parse(readFileSync(post, 'utf8')) : null,
  };
};

test('no PR: usage naming PR and COMMENT, non-zero, no gh call', () => {
  for (const vars of [[], ['PR=']]) {
    const r = run(vars);
    assert.notEqual(r.status, 0);
    assert.match(r.out, /usage: make approve-deploy PR=.*COMMENT=/);
    assert.deepEqual(r.calls, []);
  }
});

test('PR that is not a number: usage, no gh call', () => {
  const r = run(['PR=main']);
  assert.notEqual(r.status, 0);
  assert.match(r.out, /usage/);
  assert.deepEqual(r.calls, []);
});

test('preview and production pending: approves preview only, names production, shows the commit', () => {
  const r = run(['PR=7', 'COMMENT=read it'], { pending: [PREVIEW, PRODUCTION] });
  assert.equal(r.status, 0, r.out);
  assert.deepEqual(r.body, { environment_ids: [1], state: 'approved', comment: 'read it' });
  assert.match(r.out, /left for the GitHub UI: production/);
  assert.match(r.out, /abc123 Fix the header/);
});

test('COMMENT reaches GitHub verbatim: quotes, $ and backticks are not re-read by make or the shell', () => {
  const comment = 'it"s fine, costs $HOME `id` \'ok\'';
  const r = run(['PR=7', `COMMENT=${comment}`]);
  assert.equal(r.status, 0, r.out);
  assert.equal(r.body.comment, comment);
});

test('no COMMENT: the make default is posted', () => {
  const r = run(['PR=7']);
  assert.equal(r.status, 0, r.out);
  assert.equal(r.body.comment, 'Approved via make');
});

test('nothing to approve on preview: non-zero, no POST', () => {
  const cases = {
    'no waiting run': { waitingRun: '' },
    'preview not approvable by the caller': { pending: [{ ...PREVIEW, current_user_can_approve: false }] },
    'only production pending': { pending: [PRODUCTION] },
    'nothing pending': { pending: [] },
    'lookalike name': { pending: [{ environment: { id: 3, name: 'preview-prod' }, current_user_can_approve: true }] },
  };
  for (const [name, opts] of Object.entries(cases)) {
    const r = run(['PR=7'], opts);
    assert.notEqual(r.status, 0, name);
    assert.equal(r.body, null, name);
    assert.ok(!r.calls.some((c) => c.startsWith('gh api -X')), name);
  }
});
