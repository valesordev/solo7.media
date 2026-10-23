// Small HTML helpers for render tests. The components' markup is flat, so a regex reads it reliably.

export interface Anchor {
  attrs: string;
  inner: string;
}

export const anchors = (html: string): Anchor[] =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, inner]) => ({ attrs, inner }));

export const headings = (html: string) =>
  [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(([, level, inner]) => ({
    level: Number(level),
    inner,
  }));

export const decode = (text: string) =>
  text
    .replace(/<[^>]*>/g, '')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
