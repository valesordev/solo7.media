// `make check-proposal-ids` (S7M-INF-010 AC9): fail when one P<n> is used by more than one proposal mark in a brand.
// usage: node scripts/check-proposal-ids.mjs [root]
// Only brands whose foundation.md has adopted the convention (a paragraph opening "Proposal IDs") are scanned.
// The example forms in foundation.md use a literal <n>, so they never match.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isAdopted } from './decide-proposals.mjs';

const MARK = /\[PROPOSED P([1-9]\d*)\]|\[DECIDED \d{4}-\d{2}-\d{2}, PR #\d+, P([1-9]\d*)\]/g;
// Generated or installed trees, never brand sources.
const SKIP = new Set(['node_modules', 'dist', '.astro']);

function* markdown(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* markdown(p);
    else if (e.name.endsWith('.md')) yield p;
  }
}

// Returns [{ brand, id, at: ['brands/<slug>/<file>:<line>', …] }] for every ID used by more than one mark.
export function findDuplicates(root) {
  const brands = join(root, 'brands');
  const dupes = [];
  if (!existsSync(brands)) return dupes;
  for (const slug of readdirSync(brands, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()) {
    const foundation = join(brands, slug, 'brand', 'foundation.md');
    if (!existsSync(foundation) || !isAdopted(readFileSync(foundation, 'utf8'))) continue;
    const uses = new Map();
    for (const file of [...markdown(join(brands, slug))].sort()) {
      readFileSync(file, 'utf8').split('\n').forEach((text, i) => {
        for (const m of text.matchAll(MARK)) {
          const id = Number(m[1] ?? m[2]);
          uses.set(id, [...(uses.get(id) ?? []), `${relative(root, file)}:${i + 1}`]);
        }
      });
    }
    for (const [id, at] of [...uses].sort((a, b) => a[0] - b[0])) if (at.length > 1) dupes.push({ brand: slug, id, at });
  }
  return dupes;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dupes = findDuplicates(process.argv[2] ?? '.');
  for (const d of dupes) console.error(`P${d.id} is used by ${d.at.length} marks in brands/${d.brand}/: ${d.at.join(', ')}`);
  if (dupes.length) process.exitCode = 1;
  else console.log('proposal ids ok');
}
