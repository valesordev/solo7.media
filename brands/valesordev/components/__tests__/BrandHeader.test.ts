import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import BrandHeader from '../BrandHeader.astro';
import { GITHUB_ORG_URL, HOME_HREF, PROJECTS_HREF } from '../links';
import { anchors, decode } from './html';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props: Record<string, unknown> = {}) => container.renderToString(BrandHeader, { props });
const href = (attrs: string) => attrs.match(/\bhref="([^"]*)"/)?.[1];
const nav = (html: string) => html.match(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/);

describe('BrandHeader', () => {
  it('is a <header> landmark holding a <nav> with an accessible name', async () => {
    const html = await render();
    expect(html).toMatch(/^\s*<header\b/);
    const n = nav(html);
    expect(n).not.toBeNull();
    expect(n![1]).toMatch(/\baria-label="[^"]+"/);
  });

  it('links the plain-text wordmark to HOME_HREF, outside the nav', async () => {
    const html = await render();
    const [wordmark] = anchors(html);
    expect(href(wordmark.attrs)).toBe(HOME_HREF);
    expect(decode(wordmark.inner)).toBe('Valesor Development');
    expect(html.indexOf('Valesor Development')).toBeLessThan(html.indexOf('<nav'));
  });

  it('has the nav links Projects then GitHub, with hrefs from links.ts', async () => {
    const links = anchors(nav(await render())![2]);
    expect(links.map((l) => decode(l.inner))).toEqual(['Projects', 'GitHub']);
    expect(links.map((l) => href(l.attrs))).toEqual([PROJECTS_HREF, GITHUB_ORG_URL]);
  });

  it('opens GitHub in the same tab', async () => {
    const html = await render();
    expect(html).not.toMatch(/\btarget=/);
  });

  it('has three links in all, with no About link and no arrow', async () => {
    const html = await render();
    expect(anchors(html)).toHaveLength(3);
    expect(decode(html)).not.toMatch(/about/i);
    expect(decode(html)).not.toMatch(/->|→/);
  });

  it('draws no glyph, logo image, icon, or button', async () => {
    const html = await render({ current: 'projects' });
    expect(html).not.toMatch(/<(svg|img|i|button|span)\b/i);
    expect(html).not.toMatch(/\brole=/);
  });

  it('marks no link current by default', async () => {
    expect(await render()).not.toMatch(/aria-current/);
  });

  it('marks only Projects with aria-current="page" when current is "projects"', async () => {
    const links = anchors(await render({ current: 'projects' }));
    const current = links.filter((l) => /\baria-current="page"/.test(l.attrs));
    expect(current).toHaveLength(1);
    expect(decode(current[0].inner)).toBe('Projects');
  });

  // Render output carries no styles, so the decided spacing step is read from the component's <style>. Comments are
  // stripped first, and every rule is read, inside media queries too, so an override at either width fails it.
  it('spaces the nav links space.xl apart at both widths (visual-language.md#brandheader, Spacing)', () => {
    const source = readFileSync(join(import.meta.dirname, '..', 'BrandHeader.astro'), 'utf8');
    const style = (source.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
      selectors: selector.split(',').map((s) => s.trim()),
      decls: body
        .split(';')
        .map((d) => d.split(':').map((part) => part.trim()))
        .filter(([prop, value]) => prop && value),
    }));
    const isNav = (s: string) => /(^|[\s>+~])nav$/.test(s);
    const inNav = (s: string) => /(^|[\s>+~])nav[\s>+~]/.test(s);

    // A `gap` shorthand's column gap is its last value.
    const gaps = rules
      .filter((r) => r.selectors.some(isNav))
      .flatMap((r) => r.decls.filter(([prop]) => prop === 'gap' || prop === 'column-gap'))
      .map(([prop, value]) => (prop === 'gap' ? value.split(/\s+(?![^(]*\))/).at(-1) : value));
    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps).toEqual(gaps.map(() => 'var(--space-xl)'));

    // Nothing inside the nav spaces the links another way.
    const linkSpacing = rules
      .filter((r) => r.selectors.some(inNav))
      .flatMap((r) => r.decls.filter(([prop]) => /^(margin|padding)/.test(prop)));
    expect(linkSpacing).toEqual([]);
  });
});
