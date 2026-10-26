import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import { HOME_HREF } from '../links';
import TextPage from '../TextPage.astro';
import { anchors, decode, headings, styleRules } from './html';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

// Sample page text, as a page story writes it: plain <h2>, <p>, <ul>, and <a>.
const SAMPLE = `
<h2>What Is Measured</h2>
<p>Page load timing and frontend errors. See <a href="https://grafana.com/oss/faro/">Faro</a>.</p>
<ul><li>Web vitals</li><li>Frontend errors</li></ul>
<h2>What Is Not</h2>
<p>Who you are.</p>
`;

const render = (slot = SAMPLE) =>
  container.renderToString(TextPage, {
    props: { title: 'Privacy', subhead: 'What this site measures, and what it does not.' },
    slots: { default: slot },
  });
const href = (attrs: string) => attrs.match(/\bhref="([^"]*)"/)?.[1];
const source = readFileSync(join(import.meta.dirname, '..', 'TextPage.astro'), 'utf8');
const style = source.match(/<style>([\s\S]*?)<\/style>/)![1];

describe('TextPage', () => {
  it('is a <main> landmark at its root', async () => {
    const html = await render();
    expect(html).toMatch(/^\s*<main\b/);
    expect(html.trim()).toMatch(/<\/main>$/);
    expect(html.match(/<main\b/g)).toHaveLength(1);
  });

  it('has no SectionRule: BrandHeader\'s rule opens the band', async () => {
    expect(await render()).not.toMatch(/section-rule/);
  });

  it('has one <h1> with the title, then the subhead, then the page text', async () => {
    const html = await render();
    const hs = headings(html);
    expect(hs.filter((h) => h.level === 1).map((h) => decode(h.inner))).toEqual(['Privacy']);
    expect(hs[0].level).toBe(1);
    const subhead = html.match(/<p\b[^>]*class="[^"]*\bsubhead\b[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    expect(decode(subhead![1])).toBe('What this site measures, and what it does not.');
    expect(html.indexOf('</h1>')).toBeLessThan(html.indexOf('subhead'));
    expect(html.indexOf('subhead')).toBeLessThan(html.indexOf('What Is Measured'));
  });

  it('keeps the slot headings at <h2>, so the order never skips a level', async () => {
    const levels = headings(await render()).map((h) => h.level);
    expect(levels).toEqual([1, 2, 2]);
    levels.slice(1).forEach((level, i) => expect(level - levels[i]).toBeLessThanOrEqual(1));
  });

  it('ends with a secondary TextLink home reading "Return to the home page ->"', async () => {
    const html = await render();
    const links = anchors(html);
    const last = links[links.length - 1];
    expect(decode(last.inner)).toBe('Return to the home page ->');
    expect(href(last.attrs)).toBe(HOME_HREF);
    expect(last.attrs).toMatch(/class="[^"]*\bsecondary\b/);
    expect(html.lastIndexOf('Return to the home page')).toBeGreaterThan(html.lastIndexOf('Who you are.'));
  });

  it('adds no arrow to prose links', async () => {
    const prose = anchors(await render()).filter((a) => !/\btext-link\b/.test(a.attrs));
    expect(prose.map((a) => decode(a.inner))).toEqual(['Faro']);
    expect(decode(await render())).not.toContain('→');
    expect(decode(await render()).match(/->/g)).toHaveLength(1);
    // Nor through CSS: no generated content anywhere in the component.
    const rules = styleRules(source);
    expect(rules.flatMap((r) => r.selectors).filter((s) => /::?(before|after|marker)\b/.test(s))).toEqual([]);
    expect(rules.flatMap((r) => r.decls).filter(([prop]) => prop === 'content')).toEqual([]);
  });

  it('draws no hero, illustration, icon, table, or control of its own', async () => {
    const html = await render('<p>Text.</p>');
    expect(html).not.toMatch(/<(svg|img|picture|i|button|table|details|input|script)\b/i);
  });

  // Astro scopes a component's styles to its own markup, and the slot's elements are the page's, so the page-text
  // styles are :global(). Each must sit under .text, so nothing reaches BrandHeader, Footer, or outside <main>.
  it('styles slotted elements only under its own .text root', () => {
    const selectors = styleRules(source).flatMap((r) => r.selectors);
    const global = selectors.filter((s) => s.includes(':global('));
    expect(global.length).toBeGreaterThan(0);
    for (const s of global) expect(s).toMatch(/^\.text :global\([^()]*(\([^()]*\)[^()]*)*\)$/);
    for (const s of selectors) expect(s).not.toMatch(/^:global|^(html|body|main|header|footer|nav)\b/);
  });

  // An allowlist, not a list of banned values: every declaration is built from var(--…) tokens and these keywords,
  // so a named colour or an unlisted font name fails as surely as a hex value or a px length.
  it('uses tokens only: no colour, font, or length literal', () => {
    const keywords = new Set(['0', 'auto', 'normal', 'underline', 'solid', 'disc', 'outside']);
    const literals = styleRules(source).flatMap((r) =>
      r.decls
        .map(([prop, value]) => [prop, value.replace(/var\(--[a-z0-9-]+\)/g, '').trim()])
        .filter(([, rest]) => rest.split(/\s+/).some((word) => word !== '' && !keywords.has(word)))
        .map(([prop]) => `${r.selectors.join(', ')} { ${prop} }`),
    );
    expect(literals).toEqual([]);
    expect(style).not.toMatch(/@media/);
  });

  // Type, colour, and link states (visual-language.md#privacy-page-template, #interaction-states), read from the
  // <style> as the spacing is: every type, colour, decoration, and outline declaration, exactly.
  it('sets the decided type roles, colours, and prose-link states', () => {
    const look = styleRules(source).flatMap((r) =>
      r.decls
        .filter(([prop]) => /^(font|line-height|letter-spacing|color|text-decoration|outline|list-style)/.test(prop))
        .map(([prop, value]) => [r.selectors.join(', '), prop, value]),
    );
    const role = (selector: string, name: string, weight: boolean, color: string) => [
      [selector, 'font-family', `var(--type-${name}-family)`],
      [selector, 'font-size', `var(--type-${name}-size)`],
      ...(weight ? [[selector, 'font-weight', 'normal']] : []),
      [selector, 'line-height', `var(--type-${name}-line-height)`],
      [selector, 'letter-spacing', `var(--type-${name}-tracking)`],
      [selector, 'color', `var(--color-${color})`],
    ];
    expect(look).toEqual([
      ...role('.title', 'display', true, 'ink'),
      ...role('.subhead', 'body', false, 'ink-muted'),
      ...role('.text', 'body', false, 'ink'),
      ...role('.text :global(h2)', 'column-title', true, 'ink'),
      ['.text :global(ul)', 'list-style', 'disc outside'],
      ['.text :global(a), .text :global(a:visited)', 'color', 'var(--color-ink)'],
      ['.text :global(a), .text :global(a:visited)', 'text-decoration-line', 'underline'],
      ['.text :global(a), .text :global(a:visited)', 'text-decoration-thickness', 'var(--line-underline-width)'],
      ['.text :global(a), .text :global(a:visited)', 'text-decoration-color', 'var(--color-ink)'],
      ['.text :global(a:hover), .text :global(a:active)', 'text-decoration-thickness', 'var(--line-underline-width-hover)'],
      ['.text :global(a:focus-visible)', 'outline', 'var(--line-focus-width) solid var(--focus-ring)'],
      ['.text :global(a:focus-visible)', 'outline-offset', 'var(--line-focus-offset)'],
    ]);
  });

  // Render output carries no styles, so the spacing (visual-language.md#privacy-page-template, Spacing) is read from
  // the component's <style>, every rule included. Every margin, padding, gap, and offset in it must be one of these,
  // so a stray or overriding declaration fails, whatever its selector or longhand.
  it('spaces itself with the decided steps and nothing else', () => {
    const spacing = styleRules(source).flatMap((r) =>
      r.decls
        .filter(([prop]) => /^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|translate|transform)(-|$)/.test(prop))
        .map(([prop, value]) => [r.selectors.join(', '), prop, value]),
    );
    expect(spacing).toEqual([
      // The column inset (visual-language.md#layout), not text-page spacing.
      ['.text-page', 'padding-inline', 'var(--layout-inset)'],
      ['.column', 'margin-inline', 'auto'],
      // space.2xl from BrandHeader's rule to the H1, and from the home link to the Footer's rule.
      ['.column', 'padding-block', 'var(--space-2xl)'],
      // No added space between the H1 and the subhead.
      ['.title', 'margin', '0'],
      ['.subhead', 'margin', '0'],
      // space.xl from the subhead to the first section title.
      ['.text', 'padding-block-start', 'var(--space-xl)'],
      // No added space from a section title to its body; space.l above each title after the first.
      ['.text :global(h2)', 'margin', '0'],
      ['.text :global(h2:not(:first-child))', 'margin-block-start', 'var(--space-l)'],
      // space.s between paragraphs and lists, in either order.
      ['.text :global(p), .text :global(ul)', 'margin', '0'],
      [
        '.text :global(p + p), .text :global(p + ul), .text :global(ul + p), .text :global(ul + ul)',
        'margin-block-start',
        'var(--space-s)',
      ],
      // List text indented space.m; items space.2xs apart.
      ['.text :global(ul)', 'padding-inline-start', 'var(--space-m)'],
      ['.text :global(li + li)', 'margin-block-start', 'var(--space-2xs)'],
      // space.xl from the last section to the home link.
      ['.home', 'margin-block-start', 'var(--space-xl)'],
    ]);
  });

  it('caps running text at layout.measure', () => {
    const measure = styleRules(source).filter((r) =>
      r.decls.some(([prop, value]) => prop === 'max-inline-size' && value === 'var(--layout-measure)'),
    );
    expect(measure.flatMap((r) => r.selectors)).toEqual(['.text :global(p)', '.text :global(li)']);
  });
});
