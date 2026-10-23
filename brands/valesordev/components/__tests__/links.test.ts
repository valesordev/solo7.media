import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as links from '../links';

// AC9 of S7M-VAL-016: the site's fixed destinations live in links.ts, and no component spells them itself.
// The scan reads every .astro and .ts under components/ except links.ts and the tests, with comments removed, and
// fails on a string literal (any quote) that is exactly one of the destinations. A URL assembled from pieces
// ('https://github.com/' + 'valesordev') is out of its reach.
const root = join(import.meta.dirname, '..');
const sources = (readdirSync(root, { recursive: true }) as string[])
  .filter((f) => /\.(astro|ts)$/.test(f))
  .filter((f) => f !== 'links.ts' && !f.split(/[\\/]/).includes('__tests__') && f !== 'vitest.config.ts');

// Block comments (/* */, <!-- -->) anywhere, and // comments that start a line, so a "//" inside a URL survives.
const stripComments = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*\/\/.*$/gm, '');

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const destinations = Object.values(links);
const spelled = (source: string) =>
  destinations.filter((url) => new RegExp(`(["'\`])${escape(url)}\\1`).test(stripComments(source)));

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
    expect(sources).toContain('BrandHeader.astro');
  });

  for (const file of sources) {
    it(`${file} spells no destination from links.ts`, () => {
      expect(spelled(readFileSync(join(root, file), 'utf8')), relative(root, join(root, file))).toEqual([]);
    });
  }

  describe('the scan', () => {
    it.each([
      [`<a href="/">`],
      [`<a href='/'>`],
      [`<a href={'/'}>`],
      ['<a href={`/`}>'],
      [`<a href = "/">`],
      [`const home = '/';`],
      [`export const P = "/privacy/";`],
      [`<a href="https://github.com/valesordev">`],
    ])('catches %s', (source) => {
      expect(spelled(source)).not.toEqual([]);
    });

    it.each([
      [`<!-- see /privacy/ -->`],
      [`// none on '/privacy/'`],
      [`/* href="/" */`],
      [`<a href="https://github.com/valesordev/solo7.media">`],
      [`<a href={HOME_HREF}>`],
    ])('passes %s', (source) => {
      expect(spelled(source)).toEqual([]);
    });
  });
});
