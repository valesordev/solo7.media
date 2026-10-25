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

export interface StyleRule {
  selectors: string[];
  decls: [prop: string, value: string][];
}

// A component's <style> as flat rules, for the spacing steps render output can't show. Comments are stripped, and
// each innermost block is a rule, so rules inside a media query are read too.
export const styleRules = (source: string): StyleRule[] => {
  const style = (source.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selectors: selector.split(',').map((s) => s.trim()),
    decls: body
      .split(';')
      .map((d) => d.split(':').map((part) => part.trim()) as [string, string])
      .filter(([prop, value]) => prop && value),
  }));
};
