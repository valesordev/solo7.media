import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SectionRule from '../SectionRule.astro';
import { anchors, decode, headings } from './html';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (props: Record<string, unknown> = {}) => container.renderToString(SectionRule, { props });

describe('SectionRule', () => {
  it('with no title or link is the rule alone', async () => {
    const html = await render();
    expect(html).toMatch(/class="[^"]*\bsection-rule\b/);
    expect(headings(html)).toEqual([]);
    expect(anchors(html)).toEqual([]);
    expect(decode(html)).toBe('');
  });

  it('renders the title as an <h2> by default', async () => {
    const hs = headings(await render({ title: 'Projects' }));
    expect(hs).toHaveLength(1);
    expect(hs[0].level).toBe(2);
    expect(decode(hs[0].inner)).toBe('Projects');
  });

  it('renders the title as an <h3> when level is 3', async () => {
    const hs = headings(await render({ title: 'Projects', level: 3 }));
    expect(hs.map((h) => h.level)).toEqual([3]);
  });

  it('renders the link as one primary TextLink, after the title', async () => {
    const html = await render({ title: 'Projects', link: { href: '/#projects', text: 'View all projects' } });
    const links = anchors(html);
    expect(links).toHaveLength(1);
    expect(links[0].attrs).toMatch(/\bhref="\/#projects"/);
    expect(links[0].attrs).toMatch(/class="[^"]*\bprimary\b/);
    expect(decode(links[0].inner)).toBe('View all projects ->');
    expect(html.indexOf('<h2')).toBeLessThan(html.indexOf('<a'));
  });

  it('renders a link with no title, and no heading', async () => {
    const html = await render({ link: { href: '/', text: 'Go to the home page' } });
    expect(headings(html)).toEqual([]);
    expect(anchors(html)).toHaveLength(1);
  });

  it('draws no icon, number, or kicker', async () => {
    const html = await render({ title: 'Projects', link: { href: '/#projects', text: 'View all projects' } });
    expect(html).not.toMatch(/<(svg|img|i|button|hr)\b/i);
    expect(decode(html)).toBe('Projects View all projects ->');
  });
});
