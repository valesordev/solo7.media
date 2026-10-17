// `make test-scripts`: the qa-serve routing rules against a throwaway dist (node:test, offline).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveRequest, serve } from './qa-serve.mjs';

let parent;
let root;
before(() => {
  // The site root sits one level inside its own temp dir, next to a file that must never be served.
  parent = mkdtempSync(join(tmpdir(), 'qa-serve-'));
  root = join(parent, 'site');
  writeFileSync(join(parent, 'secret'), 'secret');
  mkdirSync(join(parent, 'site-x'));
  writeFileSync(join(parent, 'site-x', 'secret'), 'sibling'); // shares the root's name as a prefix
  const put = (p, body) => {
    mkdirSync(join(root, p, '..'), { recursive: true });
    writeFileSync(join(root, p), body);
  };
  put('index.html', 'home');
  put('404.html', 'root 404');
  put('privacy/index.html', 'privacy');
  put('about.html', 'about');
  put('docs/404.html', 'docs 404');
  put('_astro/site.css', 'body{}');
  put('日本/index.html', 'unicode');
  put('a?b.html', 'question'); // routes whose names need ? and # escaped in a Location
  put('a#b/index.html', 'hash');
});
after(() => rmSync(parent, { recursive: true, force: true }));

const r = (p) => {
  const x = resolveRequest(root, p);
  return x.status === 307 ? `307 ${x.location}` : `${x.status} ${x.file ? x.file.slice(root.length) : '-'}`;
};

test('directory index: served with the slash, redirected without', () => {
  assert.equal(r('/'), '200 /index.html');
  assert.equal(r('/index.html'), '307 /');
  assert.equal(r('/index'), '307 /');
  assert.equal(r('/privacy/'), '200 /privacy/index.html');
  assert.equal(r('/privacy'), '307 /privacy/');
  assert.equal(r('/privacy/index.html'), '307 /privacy/');
  assert.equal(r('/privacy/index'), '307 /privacy/');
});

test('file.html: served without the extension or slash', () => {
  assert.equal(r('/about'), '200 /about.html');
  assert.equal(r('/about.html'), '307 /about');
  assert.equal(r('/about/'), '307 /about');
  assert.equal(r('/404.html'), '307 /404');
  assert.equal(r('/404'), '200 /404.html');
});

test('assets are served as they are', () => {
  assert.equal(r('/_astro/site.css'), '200 /_astro/site.css');
});

test('missing routes get the nearest 404.html with status 404', () => {
  assert.equal(r('/does-not-exist/'), '404 /404.html');
  assert.equal(r('/does-not-exist'), '404 /404.html');
  assert.equal(r('/docs/missing/'), '404 /docs/404.html');
  assert.equal(r('/_astro/missing.css'), '404 /404.html');
});

// Two guards stop this: the `..` segment check and the containment check after resolve(). The containment check
// is defence in depth (no decoded path without a `..` segment resolves outside the root), so these tests fail only
// when both are gone.
test('paths never escape the root', () => {
  assert.equal(r('/../secret'), '404 /404.html');
  assert.equal(r('/../site-x/secret'), '404 /404.html');
  assert.equal(r('/%2e%2e/secret'), '404 /404.html');
  assert.equal(r('/..%2Fsecret'), '404 /404.html');
  assert.equal(r('/' + '../'.repeat(64) + 'etc/passwd'), '404 /404.html');
  assert.equal(r('/' + '..%2F'.repeat(64) + 'etc/passwd'), '404 /404.html');
  assert.equal(r('/%E0%A4%A'), '404 /404.html');
});

test('over HTTP: 404 body and status, redirect keeps the query', async () => {
  const { server, origin } = await serve(root);
  // Every request is bounded, so a server that never answers fails this test instead of hanging make check.
  const fetch = (url, init = {}) => globalThis.fetch(url, { signal: AbortSignal.timeout(5000), ...init });
  try {
    const missing = await fetch(`${origin}/does-not-exist/`);
    assert.equal(missing.status, 404);
    assert.equal(await missing.text(), 'root 404');
    const moved = await fetch(`${origin}/privacy?x=1`, { redirect: 'manual' });
    assert.equal(moved.status, 307);
    assert.equal(moved.headers.get('location'), '/privacy/?x=1');
    const page = await fetch(`${origin}/404.html`);
    assert.equal(page.status, 200);
    assert.equal(page.url, `${origin}/404`);
    assert.equal(await page.text(), 'root 404');
    // Chromium drops a stylesheet served with the wrong type, so a bad mapping would shoot an unstyled page.
    assert.equal(page.headers.get('content-type'), 'text/html; charset=utf-8');
    const css = await fetch(`${origin}/_astro/site.css`);
    assert.equal(css.headers.get('content-type'), 'text/css; charset=utf-8');
    const head = await fetch(`${origin}/`, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(head.headers.get('content-length'), '4');
    assert.equal(await head.text(), '');
    const post = await fetch(`${origin}/`, { method: 'POST' });
    assert.equal(post.status, 405);
    // A redirect to a non-ASCII route goes out percent-encoded (a raw one makes writeHead throw).
    const uni = await fetch(`${origin}/%E6%97%A5%E6%9C%AC?q=1`, { redirect: 'manual' });
    assert.equal(uni.status, 307);
    assert.equal(uni.headers.get('location'), '/%E6%97%A5%E6%9C%AC/?q=1');
    const followed = await fetch(`${origin}/%E6%97%A5%E6%9C%AC`);
    assert.equal(await followed.text(), 'unicode');
    // ? and # in a route name stay escaped, or the redirect lands on a query or a fragment of another route.
    const question = await fetch(`${origin}/a%3Fb.html`, { redirect: 'manual' });
    assert.equal(question.headers.get('location'), '/a%3Fb');
    assert.equal(await (await fetch(`${origin}/a%3Fb.html`)).text(), 'question');
    const hash = await fetch(`${origin}/a%23b`, { redirect: 'manual' });
    assert.equal(hash.headers.get('location'), '/a%23b/');
    assert.equal(await (await fetch(`${origin}/a%23b`)).text(), 'hash');
  } finally {
    server.closeAllConnections();
    server.close();
  }
});
