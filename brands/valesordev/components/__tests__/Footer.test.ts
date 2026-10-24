import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Footer from '../Footer.astro';
import { GITHUB_ORG_URL, PRIVACY_HREF } from '../links';
import { anchors, decode, headings, styleRules } from './html';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = () => container.renderToString(Footer);
const href = (attrs: string) => attrs.match(/\bhref="([^"]*)"/)?.[1];
const nav = (html: string) => html.match(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/);
const paragraphs = (html: string) => [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(([, inner]) => decode(inner));

describe('Footer', () => {
  it('is a <footer> landmark holding a <nav> with an accessible name', async () => {
    const html = await render();
    expect(html).toMatch(/^\s*<footer\b/);
    expect(html.trim()).toMatch(/<\/footer>$/);
    const n = nav(html);
    expect(n).not.toBeNull();
    expect(n![1]).toMatch(/\baria-label="[^"]+"/);
  });

  it('opens with the SectionRule rule alone', async () => {
    const html = await render();
    expect(html).toMatch(/class="[^"]*\bsection-rule\b/);
    expect(headings(html)).toEqual([]);
    expect(html.indexOf('section-rule')).toBeLessThan(html.indexOf('Valesor Development'));
  });

  it('has the plain-text name, then the license statement on its own line', async () => {
    const html = await render();
    expect(paragraphs(html)).toEqual(['Valesor Development', 'Released under Apache-2.0 by default.']);
    expect(anchors(html).map((a) => decode(a.inner))).not.toContain('Valesor Development');
  });

  it('has two links, GitHub then Privacy, with hrefs from links.ts, in the nav', async () => {
    const html = await render();
    const links = anchors(nav(html)![2]);
    expect(links.map((l) => decode(l.inner))).toEqual(['GitHub', 'Privacy']);
    expect(links.map((l) => href(l.attrs))).toEqual([GITHUB_ORG_URL, PRIVACY_HREF]);
    expect(anchors(html)).toHaveLength(2);
  });

  it('opens GitHub in the same tab, with no arrow or icon on any link', async () => {
    const html = await render();
    expect(html).not.toMatch(/\btarget=/);
    expect(decode(html)).not.toMatch(/->|→/);
    expect(html).not.toMatch(/<(svg|img|i|button)\b/i);
  });

  it('has no copyright symbol, year, or rights line', async () => {
    const text = decode(await render());
    expect(text).not.toMatch(/©|\(c\)|&copy;/i);
    expect(text).not.toMatch(/\b\d{4}\b/);
    expect(text).not.toMatch(/rights reserved/i);
  });

  // Render output carries no styles, so the spacing steps (visual-language.md#footer, Spacing) are read from the
  // component's <style>, every rule included, inside the media query too.
  describe('spacing', () => {
    const rules = styleRules(readFileSync(join(import.meta.dirname, '..', 'Footer.astro'), 'utf8'));
    const decl = (selector: string, prop: string) =>
      rules.filter((r) => r.selectors.includes(selector)).flatMap((r) => r.decls.filter(([p]) => p === prop).map(([, v]) => v));

    it('uses only space.s, space.m, and space.xl', () => {
      const steps = new Set(rules.flatMap((r) => r.decls.flatMap(([, v]) => v.match(/--space-[\w-]+/g) ?? [])));
      expect([...steps].sort()).toEqual(['--space-m', '--space-s', '--space-xl']);
    });

    it('sets the row space.m below the rule and space.xl above the page end', () => {
      expect(decl('.row', 'padding-block')).toEqual(['var(--space-m) var(--space-xl)']);
    });

    it('puts space.s between the groups when stacked and at least space.m when side by side', () => {
      expect(decl('.row', 'gap')).toEqual(['var(--space-s) var(--space-m)']);
    });

    it('spaces GitHub and Privacy space.xl apart at both widths', () => {
      expect(decl('nav', 'column-gap')).toEqual(['var(--space-xl)']);
      expect(decl('nav', 'gap')).toEqual([]);
    });
  });
});
