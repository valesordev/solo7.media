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

function openFollowUp(repo, s) {
  const branch = `auto/decide-proposals-${s.pr}`;
  const [owner] = repo.split('/');

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
  }

  const open = json(`repos/${repo}/pulls?head=${owner}:${branch}&state=open`);
  if (open.length) return open[0].number;
  const body = [
    `Decides the proposal IDs Brian checked on #${s.pr}: ${s.decided.map((id) => `P${id}`).join(', ')}.`,
    `Each \`[PROPOSED P<n>]\` becomes \`[DECIDED ${s.date}, PR #${s.pr}, P<n>]\`; nothing else in these files changes.`,
    s.left.length ? `Still open: ${s.left.map((l) => `P${l.id} (${l.reason})`).join(', ')}.` : 'Still open: none.',
    '',
    'Opened by `.github/workflows/decide-proposals.yml` (`make decide-proposals`). Review and merge it like any other PR.',
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
  const followUp = s.files.length ? openFollowUp(repo, s) : null;
  if (followUp) console.log(`follow-up PR #${followUp}`);
  upsertComment(repo, s.pr, commentBody(s, followUp));
  console.log(`commented on #${s.pr}`);
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
