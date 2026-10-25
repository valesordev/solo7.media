// Publish what decide-proposals wrote (S7M-INF-010 AC6, AC7): a follow-up PR with the decided marks, and a
// comment on the merged PR listing the IDs decided and the IDs still open.
// usage: node scripts/publish-decided-proposals.mjs <summary.json>
// Needs GH_TOKEN (the story-bot App token in CI) and GITHUB_REPOSITORY (owner/name). The commit is made through
// the GraphQL API (createCommitOnBranch), never `git push`, so GitHub signs it. It never writes to main.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const MARKER = '<!-- decide-proposals -->';

const gh = (args, input) =>
  execFileSync('gh', args, { encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'inherit'], maxBuffer: 64 << 20 });
const api = (path, ...args) => gh(['api', path, ...args]);
const json = (path, ...args) => JSON.parse(api(path, ...args) || 'null');

// The comment on the merged PR. Exported for the tests.
export function commentBody(s, followUp) {
  const ids = (xs) => xs.map((id) => `P${id}`).join(', ');
  const lines = [MARKER];
  lines.push(s.decided.length
    ? `Decided from this PR's checked boxes: ${ids(s.decided)}, in #${followUp} (\`[DECIDED ${s.date}, PR #${s.pr}, P<n>]\`).`
    : 'Nothing decided: no checked proposal ID on this PR.');
  lines.push(s.left.length
    ? `Still open: ${s.left.map((l) => `P${l.id} (${l.reason})`).join(', ')}.`
    : 'Still open: none.');
  return lines.join('\n');
}

function upsertComment(repo, pr, body) {
  const id = api(`repos/${repo}/issues/${pr}/comments`, '--paginate',
    '--jq', `[.[] | select(.user.type == "Bot" and (.body | startswith("${MARKER}")))][0].id // empty`).trim();
  if (id) api(`repos/${repo}/issues/comments/${id}`, '-X', 'PATCH', '-f', `body=${body}`);
  else api(`repos/${repo}/issues/${pr}/comments`, '-f', `body=${body}`);
}

const branchFor = (s) => `auto/decide-proposals-${s.pr}`;
const list = (ids) => ids.map((id) => `P${id}`).join(', ') || 'nothing';

// An earlier run's follow-up, open or merged, records what it decided. Every run checks it, including one that
// decides nothing, and fails if this run's IDs differ (Brian may have changed the boxes since). A closed,
// unmerged follow-up is ignored. Returns the open or merged follow-ups, all deciding exactly this run's IDs.
function priorFollowUps(repo, s) {
  const [owner] = repo.split('/');
  const pulls = json(`repos/${repo}/pulls?head=${owner}:${branchFor(s)}&state=all`).filter((p) => p.merged_at || p.state === 'open');
  for (const p of pulls) {
    const recorded = (/<!-- decided: ([\d,]*) -->/.exec(p.body ?? '')?.[1] ?? '').split(',').filter(Boolean).map(Number);
    if (recorded.join() !== s.decided.join()) {
      throw new Error(`#${p.number} decided ${list(recorded)}; this run decides ${list(s.decided)}. `
        + (p.merged_at ? 'It has merged: decide the difference in a new PR.' : 'Close it, delete its branch, and re-run.'));
    }
  }
  return pulls;
}

function openFollowUp(repo, s, pulls) {
  const branch = branchFor(s);
  // Already merged with the same IDs: the marks are decided on main, so point at it and stop.
  const merged = pulls.find((p) => p.merged_at);
  if (merged) return merged.number;

  // A re-run finds the branch it made: still at the merge commit (commit not made yet), or carrying its commit.
  let head = null;
  try { head = json(`repos/${repo}/git/ref/heads/${branch}`).object.sha; } catch { /* 404: no branch yet */ }
  if (!head) {
    api(`repos/${repo}/git/refs`, '-f', `ref=refs/heads/${branch}`, '-f', `sha=${s.mergeSha}`);
    head = s.mergeSha;
  }
  if (head === s.mergeSha) {
    const query = `mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } } }`;
    const input = {
      branch: { repositoryNameWithOwner: repo, branchName: branch },
      expectedHeadOid: s.mergeSha,
      message: { headline: `docs: decide checked proposals from #${s.pr}`, body: `Decided: ${s.decided.map((id) => `P${id}`).join(', ')}.` },
      fileChanges: { additions: s.files.map((path) => ({ path, contents: readFileSync(path).toString('base64') })) },
    };
    gh(['api', 'graphql', '--input', '-'], JSON.stringify({ query, variables: { input } }));
  } else {
    const parent = json(`repos/${repo}/git/commits/${head}`).parents?.[0]?.sha;
    if (parent !== s.mergeSha) throw new Error(`${branch} exists at ${head}, not built on the merge commit ${s.mergeSha}; delete it and re-run`);
    // Its commit must change exactly this run's files, with this run's content (the boxes may have changed since).
    const changed = json(`repos/${repo}/compare/${s.mergeSha}...${head}`).files.map((f) => f.filename).sort();
    if (changed.join('\n') !== [...s.files].sort().join('\n')) {
      throw new Error(`${branch} changes ${changed.join(', ')}; this run changes ${s.files.join(', ')}; delete the branch and re-run`);
    }
    for (const path of s.files) {
      const at = json(`repos/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`);
      if (Buffer.compare(Buffer.from(at.content ?? '', 'base64'), readFileSync(path)) !== 0) {
        throw new Error(`${branch} has ${path} as an earlier run left it, which differs from this run; close its PR, delete the branch, and re-run`);
      }
    }
  }

  const open = pulls.filter((p) => p.state === 'open');
  if (open.length) return open[0].number;
  const body = [
    `Decides the proposal IDs Brian checked on #${s.pr}: ${list(s.decided)}.`,
    `Each \`[PROPOSED P<n>]\` becomes \`[DECIDED ${s.date}, PR #${s.pr}, P<n>]\`; nothing else in these files changes.`,
    s.left.length ? `Still open: ${s.left.map((l) => `P${l.id} (${l.reason})`).join(', ')}.` : 'Still open: none.',
    '',
    'Opened by `.github/workflows/decide-proposals.yml` (`make decide-proposals`). Review and merge it like any other PR.',
    // Read back by a re-run (above); keep it in the body.
    `<!-- decided: ${s.decided.join(',')} -->`,
  ].join('\n');
  return json(`repos/${repo}/pulls`, '-f', `title=Decide checked proposals from #${s.pr}`, '-f', `head=${branch}`,
    '-f', 'base=main', '-f', `body=${body}`).number;
}

function main([summaryPath]) {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!summaryPath || !repo) {
    console.error('usage: GITHUB_REPOSITORY=<owner/name> publish-decided-proposals.mjs <summary.json>');
    return 2;
  }
  const s = JSON.parse(readFileSync(summaryPath, 'utf8'));
  const pulls = priorFollowUps(repo, s);
  const followUp = s.files.length ? openFollowUp(repo, s, pulls) : null;
  if (followUp) console.log(`follow-up PR #${followUp}`);
  upsertComment(repo, s.pr, commentBody(s, followUp));
  console.log(`commented on #${s.pr}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
