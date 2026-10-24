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

  // Render output carries no styles, so the spacing (visual-language.md#footer, Spacing) is read from the component's
  // <style>, every rule included, inside the media query too. Every margin, padding, and gap in it must be one of
  // these, so a stray or overriding declaration fails, whatever its selector or longhand.
  it('spaces itself with the decided steps and nothing else', () => {
    const rules = styleRules(readFileSync(join(import.meta.dirname, '..', 'Footer.astro'), 'utf8'));
    const spacing = rules.flatMap((r) =>
      r.decls
        .filter(([prop]) => /^(margin|padding|gap|row-gap|column-gap)(-|$)/.test(prop))
        .map(([prop, value]) => [r.selectors.join(', '), prop, value]),
    );
    expect(spacing).toEqual([
      // The column inset (visual-language.md#layout), not footer spacing.
      ['.site-footer', 'padding-inline', 'var(--layout-inset)'],
      ['.column', 'margin-inline', 'auto'],
      // space.s between the stacked groups (narrow); at least space.m between them side by side (wide).
      ['.row', 'gap', 'var(--space-s) var(--space-m)'],
      // space.m below the rule; space.xl at the page end.
      ['.row', 'padding-block', 'var(--space-m) var(--space-xl)'],
      // No added space between the name and the statement.
      ['p', 'margin', '0'],
      // GitHub and Privacy space.xl apart, at both widths.
      ['nav', 'column-gap', 'var(--space-xl)'],
    ]);
  });
});
