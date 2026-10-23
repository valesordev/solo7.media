import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import * as links from '../links';

// AC9 of S7M-VAL-016: the site's fixed destinations live in links.ts, and no component spells them itself.
// The scan is fail-safe: it reads raw source, comments and styles included, so a destination written anywhere in a
// component fails it, even in a comment or a CSS `content` (reword the comment; take the value from links.ts).
// A URL assembled from pieces ('https://github.com/' + 'valesordev') is out of its reach.
const root = join(import.meta.dirname, '..');

/** Every source file under dir that could spell a destination: not links.ts, the tests, or the test config. */
const sourcesUnder = (dir: string) =>
  (readdirSync(dir, { recursive: true }) as string[])
    .map((f) => f.split(/[\\/]/).join('/'))
    .filter((f) => /\.(astro|[cm]?[jt]s)$/.test(f))
    .filter((f) => f !== 'links.ts' && f !== 'vitest.config.ts' && !f.split('/').includes('__tests__'));

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
// A destination as a whole value: after a quote or `=`, and not followed by more of a path or name.
const patterns = Object.values(links).map(
  (url) => [url, new RegExp(`(?:["'\`]|=\\s*)${escape(url)}(?![\\w./#-])`)] as const,
);
const spelled = (source: string) => patterns.filter(([, re]) => re.test(source)).map(([url]) => url);

describe('links.ts', () => {
  it('holds the four destinations', () => {
    expect({ ...links }).toEqual({
      HOME_HREF: '/',
      PROJECTS_HREF: '/#projects',
      GITHUB_ORG_URL: 'https://github.com/valesordev',
      PRIVACY_HREF: '/privacy/',
    });
  });

  it('finds the components to check', () => {
    expect(sourcesUnder(root)).toContain('BrandHeader.astro');
  });

  for (const file of sourcesUnder(root)) {
    it(`${file} spells no destination from links.ts`, () => {
      expect(spelled(readFileSync(join(root, file), 'utf8'))).toEqual([]);
    });
  }

  describe('the walk', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'links-walk-'));
    afterAll(() => rmSync(tmp, { recursive: true, force: true }));
    const files = ['A.astro', 'sub/B.astro', 'helper.ts', 'util.mjs', 'x.js', 'links.ts', 'vitest.config.ts', '__tests__/t.ts', 'notes.md'];
    for (const f of files) {
      mkdirSync(dirname(join(tmp, f)), { recursive: true });
      writeFileSync(join(tmp, f), '');
    }

    it('reads nested components and script helpers, and skips links.ts, the tests and other files', () => {
      expect(sourcesUnder(tmp).sort()).toEqual(['A.astro', 'helper.ts', 'sub/B.astro', 'util.mjs', 'x.js']);
    });
  });

  describe('the scan', () => {
    it.each([
      [`<a href="/">`],
      [`<a href='/'>`],
      [`<a href={'/'}>`],
      ['<a href={`/`}>'],
      [`<a href = "/">`],
      [`<a href=/ >`],
      [`<a href=/#projects>`],
      [`const home = '/';`],
      [`export const P = "/privacy/";`],
      [`<a href="https://github.com/valesordev">`],
      [`<!-- <a href="/privacy/"> -->`],
      [`x = HOME_HREF; // was '/'`],
      [`const icons = import.meta.glob('./icons/*.svg');\n<a href="/">\n<style>/* c */</style>`],
    ])('catches %s', (source) => {
      expect(spelled(source)).not.toEqual([]);
    });

    it.each([
      [`<a href={HOME_HREF}>`],
      [`<a href="https://github.com/valesordev/solo7.media">`],
      [`<a href="/privacy/policy/">`],
      [`<img src="/x.svg" />`],
      [`</a><br />`],
      [`grid-area: 1 / 2;`],
      [`import.meta.glob('./icons/*.svg')`],
    ])('passes %s', (source) => {
      expect(spelled(source)).toEqual([]);
    });
  });
});
