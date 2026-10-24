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

  // Render output carries no styles, so the decided spacing step is read from the component's source.
  it('spaces the nav links space.xl apart (visual-language.md#brandheader, Spacing)', () => {
    const source = readFileSync(join(import.meta.dirname, '..', 'BrandHeader.astro'), 'utf8');
    const navRule = source.match(/^\s*nav\s*\{([^}]*)\}/m);
    expect(navRule).not.toBeNull();
    expect(navRule![1]).toMatch(/column-gap:\s*var\(--space-xl\);/);
  });
});
