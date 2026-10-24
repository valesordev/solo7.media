// `make test-scripts`: the duplicate proposal-ID lint against fixture brand trees (node:test, offline).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { findDuplicates } from './check-proposal-ids.mjs';

const ADOPTED = '# F\n\nProposal IDs (S7M-VAL-019). Each is `[PROPOSED P<n>]`; decided is `[DECIDED <YYYY-MM-DD>, PR #<pr>, P<n>]`.\n';
let root;
const put = (p, text) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), text); };
const dupes = () => findDuplicates(root).map((d) => `${d.brand} P${d.id}: ${d.at.join(', ')}`);

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'proposal-ids-'));
  put('brands/valesordev/brand/foundation.md', ADOPTED);
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

test('two [PROPOSED P<n>] with one ID, in one file: fails naming both lines', () => {
  put('brands/valesordev/brand/usage.md', 'a [PROPOSED P1]\nb\nc [PROPOSED P1]\n');
  assert.deepEqual(dupes(), ['valesordev P1: brands/valesordev/brand/usage.md:1, brands/valesordev/brand/usage.md:3']);
});

test('two marks with one ID in two files, including a nested folder: fails naming both', () => {
  put('brands/valesordev/brand/usage.md', 'a [PROPOSED P4]\n');
  put('brands/valesordev/assets/hero/slot.md', 'x\nb [PROPOSED P4]\n');
  assert.deepEqual(dupes(), ['valesordev P4: brands/valesordev/assets/hero/slot.md:2, brands/valesordev/brand/usage.md:1']);
});

test('a [PROPOSED P<n>] and a [DECIDED …, P<n>] with one ID: fails', () => {
  put('brands/valesordev/brand/usage.md', 'a [DECIDED 2026-10-24, PR #42, P2]\nb [PROPOSED P2]\n');
  assert.equal(dupes().length, 1);
});

test('unique IDs pass; bare marks, the literal <n> examples and other brands do not count', () => {
  put('brands/valesordev/brand/usage.md', 'a [PROPOSED P1] [PROPOSED] [DECIDED 2026-10-08]\nb [DECIDED 2026-10-24, PR #42, P2]\n');
  put('brands/valesordev/brand/voice.md', 'c [PROPOSED] again [DECIDED 2026-10-08] again\n');
  put('brands/bashburn/brand/foundation.md', ADOPTED);
  put('brands/bashburn/brand/usage.md', 'same ID, other brand [PROPOSED P1]\n');
  assert.deepEqual(dupes(), []);
});

test('an unadopted brand with a duplicate is ignored', () => {
  put('brands/system9studios/brand/foundation.md', '# S9\n\nWe may adopt Proposal IDs later.\n');
  put('brands/system9studios/brand/usage.md', 'a [PROPOSED P1]\nb [PROPOSED P1]\n');
  put('brands/solo7media/brand/usage.md', 'no foundation [PROPOSED P1] [PROPOSED P1]\n');
  assert.deepEqual(dupes(), []);
});

test('generated trees and non-markdown files are not scanned', () => {
  put('brands/valesordev/brand/usage.md', 'a [PROPOSED P1]\n');
  put('brands/valesordev/dist/copy.md', 'a [PROPOSED P1]\n');
  put('brands/valesordev/node_modules/x/readme.md', 'a [PROPOSED P1]\n');
  put('brands/valesordev/tokens/notes.txt', 'a [PROPOSED P1]\n');
  assert.deepEqual(dupes(), []);
});
