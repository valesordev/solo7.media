import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as links from '../links';

// AC9 of S7M-VAL-016: the site's fixed destinations live in links.ts, and no component spells them itself.
const dir = join(import.meta.dirname, '..');
const components = readdirSync(dir).filter((f) => f.endsWith('.astro'));

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
    expect(components).toContain('BrandHeader.astro');
  });

  for (const file of components) {
    it(`${file} spells no destination from links.ts`, () => {
      const source = readFileSync(join(dir, file), 'utf8');
      for (const url of [links.PROJECTS_HREF, links.GITHUB_ORG_URL, links.PRIVACY_HREF]) {
        expect(source).not.toContain(url);
      }
      expect(source).not.toMatch(/\bhref=["']\/["']/);
    });
  }
});
