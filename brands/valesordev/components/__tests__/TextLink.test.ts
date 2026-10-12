import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import TextLink from '../TextLink.astro';
import { anchors, decode } from './html';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const render = (variant: 'primary' | 'secondary', text: string, href = '/x/') =>
  container.renderToString(TextLink, { props: { href, variant }, slots: { default: text } });

describe('TextLink', () => {
  for (const variant of ['primary', 'secondary'] as const) {
    describe(variant, () => {
      it('is one link to href, with the variant class', async () => {
        const html = await render(variant, 'Browse the source', 'https://github.com/valesordev');
        const links = anchors(html);
        expect(links).toHaveLength(1);
        expect(links[0].attrs).toMatch(/\bhref="https:\/\/github\.com\/valesordev"/);
        expect(links[0].attrs).toMatch(new RegExp(`class="[^"]*\\b${variant}\\b`));
      });

      it('ends its link text with a typed " ->", inside the <a>', async () => {
        const html = await render(variant, 'Read the license');
        const [link] = anchors(html);
        expect(decode(link.inner)).toBe('Read the license ->');
        expect(html).not.toContain('→');
      });

      it('draws no icon, image, or button', async () => {
        const html = await render(variant, 'Read the license');
        expect(html).not.toMatch(/<(svg|img|i|button|span)\b/i);
        expect(html).not.toMatch(/\brole=/);
      });
    });
  }
});
