// `make test-scripts`: the qa-serve routing rules against a throwaway dist (node:test, offline).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveRequest, serve } from './qa-serve.mjs';

let root;
before(() => {
  root = mkdtempSync(join(tmpdir(), 'qa-serve-'));
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
});
after(() => rmSync(root, { recursive: true, force: true }));

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

test('paths never escape the root', () => {
  assert.equal(r('/../etc/passwd'), '404 /404.html');
  assert.equal(r('/%2e%2e/etc/passwd'), '404 /404.html');
  assert.equal(r('/%E0%A4%A'), '404 /404.html');
});

test('over HTTP: 404 body and status, redirect keeps the query', async () => {
  const { server, origin } = await serve(root);
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
  } finally {
    server.close();
  }
});
