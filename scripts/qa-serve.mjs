#!/usr/bin/env node
// Serves a built site over http://127.0.0.1 the way its Cloudflare Workers static assets do (ADR 0001 §4, §9):
// html_handling "auto-trailing-slash" (the default) and not_found_handling "404-page".
//   /x.html exists:        /x -> 200, /x.html and /x/ -> 307 /x
//   /x/index.html exists:  /x/ -> 200, /x, /x/index and /x/index.html -> 307 /x/
//   anything else missing: the nearest 404.html up the tree, status 404
// Usage: node scripts/qa-serve.mjs <dist-dir> [port]   (also imported by qa-shots.mjs)
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

// Decides the response for a URL path without touching the network: { status, file } or { status: 307, location }.
export function resolveRequest(root, urlPath) {
  root = resolve(root);
  const isFile = (p) => {
    const full = resolve(root, '.' + p);
    if (full !== root && !full.startsWith(root + sep)) return false;
    try { return statSync(full).isFile(); } catch { return false; }
  };
  const ok = (p) => ({ status: 200, file: resolve(root, '.' + p) });
  const to = (location) => ({ status: 307, location });

  let p;
  try { p = decodeURIComponent(urlPath); } catch { return notFound(root, '/', isFile); }
  if (!p.startsWith('/') || p.includes('\0') || p.split('/').includes('..')) return notFound(root, '/', isFile);

  if (p.endsWith('/')) {
    if (isFile(p + 'index.html')) return ok(p + 'index.html');
    if (p !== '/' && isFile(p.slice(0, -1) + '.html')) return to(p.slice(0, -1));
    return notFound(root, p, isFile);
  }
  if (p.endsWith('/index.html') && isFile(p)) return to(p.slice(0, -'index.html'.length));
  if (p.endsWith('.html') && isFile(p)) return to(p.slice(0, -'.html'.length));
  if (isFile(p)) return ok(p);
  if (p.endsWith('/index') && isFile(p + '.html')) return to(p.slice(0, -'index'.length));
  if (isFile(p + '.html')) return ok(p + '.html');
  if (isFile(p + '/index.html')) return to(p + '/');
  return notFound(root, p, isFile);
}

function notFound(root, p, isFile) {
  let dir = p.slice(0, p.lastIndexOf('/') + 1);
  for (;;) {
    if (isFile(dir + '404.html')) return { status: 404, file: resolve(root, '.' + dir + '404.html') };
    if (dir === '/') return { status: 404, file: null };
    dir = dir.slice(0, dir.slice(0, -1).lastIndexOf('/') + 1);
  }
}

export function serve(root, port = 0) {
  // A handler that throws still answers (500), so no request is left hanging.
  const server = createServer((req, res) => {
    try {
      handle(req, res);
    } catch (e) {
      console.error(`qa-serve: ${req.url}: ${e.message}`);
      if (!res.headersSent) res.writeHead(500, { 'content-type': TYPES['.txt'] });
      res.end();
    }
  });
  const handle = (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { allow: 'GET, HEAD' }).end();
      return;
    }
    const url = new URL(req.url, 'http://localhost');
    const r = resolveRequest(root, url.pathname);
    if (r.status === 307) {
      // resolveRequest works on the decoded path; the header needs it encoded again, one segment at a time.
      const location = r.location.split('/').map(encodeURIComponent).join('/');
      res.writeHead(307, { location: location + url.search }).end();
      return;
    }
    const body = r.file ? readFileSync(r.file) : Buffer.from('Not found\n');
    const type = r.file ? TYPES[extname(r.file).toLowerCase()] ?? 'application/octet-stream' : TYPES['.txt'];
    res.writeHead(r.status, { 'content-type': type, 'content-length': body.length, 'cache-control': 'no-store' });
    res.end(body); // node's http omits the body of a HEAD response itself
  };
  return new Promise((ok, fail) => {
    server.once('error', fail);
    server.listen(port, '127.0.0.1', () => ok({ server, origin: `http://127.0.0.1:${server.address().port}` }));
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [root, port = '4321'] = process.argv.slice(2);
  try {
    if (!root || !statSync(join(root, 'index.html')).isFile()) throw new Error();
  } catch {
    console.error(`qa-serve: ${root ?? '<dist-dir>'} has no index.html; build the site first`);
    process.exit(1);
  }
  const { origin } = await serve(root, Number(port));
  console.log(`qa-serve: ${resolve(root)} at ${origin}/ (Ctrl-C to stop)`);
}
