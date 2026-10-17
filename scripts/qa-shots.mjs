#!/usr/bin/env node
// Rendered screenshots for /brand-qa (ADR 0001 §9). Run by `make qa-shots-<slug>`, which builds the site first.
// Serves the built site (and, when asked, the component specimens) with qa-serve.mjs, then for each requested
// page or specimen at each width, with JavaScript off: a full-page screenshot, the interaction states of every
// link and button (rest, hover, active, focus-visible by keyboard, visited), and a report of target sizes and
// horizontal scroll. Output: dist/qa/<slug>/shots/ at the repo root. Runbook: docs/runbooks/brand-qa-screenshots.md
//
// node scripts/qa-shots.mjs --slug <slug> --site sites/<domain> --widths 1440,390,320 \
//   [--pages /,404] [--specimens Name,Name]
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import { serve } from './qa-serve.mjs';

const STATES = ['rest', 'hover', 'active', 'focus-visible', 'visited'];
const INTERACTIVE = 'a[href], area[href], button, summary, input:not([type=hidden]), select, textarea, [role=button], [role=link], [tabindex]:not([tabindex="-1"])';
const HEIGHT = 900; // viewport height; every page screenshot is full-page, so it only sets the first fold
const WATCHDOG_S = 300; // per page or specimen per width
const PAD = 8; // px around an element in its state images, so a 2px outline at a 2px offset is in frame
const repo = resolve(import.meta.dirname, '..');

const { values: args } = parseArgs({
  options: {
    slug: { type: 'string' },
    site: { type: 'string' },
    widths: { type: 'string' },
    pages: { type: 'string', default: '' },
    specimens: { type: 'string', default: '' },
  },
});
const list = (s) => s.split(/[\s,]+/).filter(Boolean);
const fail = (msg) => {
  console.error(`qa-shots: ${msg}`);
  process.exit(1);
};

if (!args.slug || !args.site || !args.widths) fail('needs --slug, --site and --widths');
const widths = list(args.widths).map(Number);
if (!widths.length || widths.some((w) => !Number.isInteger(w) || w < 1)) fail(`bad --widths: ${args.widths}`);
const pages = list(args.pages);
const specimens = list(args.specimens);
if (!pages.length && !specimens.length) fail('nothing to shoot: set QA_PAGES or QA_SPECIMENS');
for (const p of pages) if (p !== '404' && !p.startsWith('/')) fail(`QA_PAGES entry "${p}" is neither a route starting with / nor 404`);
// A . or .. segment would name an output dir outside shots/<name>/.
for (const p of pages) if (p.split('/').some((s) => s === '.' || s === '..')) fail(`QA_PAGES entry "${p}" has a . or .. segment`);
for (const s of specimens) if (!/^[A-Za-z0-9_-]+$/.test(s)) fail(`QA_SPECIMENS entry "${s}" is not a specimen name`);

const site = resolve(repo, args.site);
const siteDist = join(site, 'dist');
const qaDir = join(repo, 'dist', 'qa', args.slug);
const specimenDist = join(qaDir, 'specimens');
const shotsDir = join(qaDir, 'shots');
const rel = (p) => relative(repo, p);

if (pages.length && !existsSync(join(siteDist, 'index.html'))) fail(`${rel(siteDist)} has no index.html; run make build-site-${args.slug}`);

const targets = [
  ...pages.map((p) => ({
    kind: 'page',
    request: p,
    name: p === '404' ? '404' : p.replace(/^\/|\/$/g, '').replace(/[^A-Za-z0-9_.-]+/g, '-') || 'index',
    path: p === '404' ? '/404.html' : p,
  })),
  ...specimens.map((s) => ({ kind: 'specimen', request: s, name: `specimen-${s}`, path: `/${s}/` })),
];
// Two requests with one output name would overwrite each other's images (/a/b/ and /a-b/, or a repeated entry).
// Checked before anything is built or the previous run's shots are removed.
for (const [name, ts] of Object.entries(Object.groupBy(targets, (t) => t.name))) {
  if (ts.length > 1) fail(`${ts.map((t) => t.request).join(' and ')} would both write shots/${name}/; request one of them per run`);
}

// Specimens: the second Astro root (ADR 0001 §9), built only when asked for.
if (specimens.length) {
  const config = join(site, 'astro.specimens.config.mjs');
  if (!existsSync(config)) fail(`QA_SPECIMENS is set but ${rel(config)} does not exist (implementation adds it with the first specimen, ADR 0001 §9)`);
  console.log(`qa-shots: building specimens with ${rel(config)}`);
  try {
    execFileSync('npx', ['--no-install', 'astro', 'build', '--config', 'astro.specimens.config.mjs'], {
      cwd: site,
      stdio: 'inherit',
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', DO_NOT_TRACK: '1' },
    });
  } catch {
    fail('the specimen build failed');
  }
  if (!existsSync(specimenDist)) fail(`the specimen build wrote nothing to ${rel(specimenDist)}; check outDir in ${rel(config)}`);
}

rmSync(shotsDir, { recursive: true, force: true });
mkdirSync(shotsDir, { recursive: true });

const servers = [];
const origins = {};
if (pages.length) ({ origin: origins.site } = await serve(siteDist).then((s) => (servers.push(s.server), s)));
if (specimens.length) ({ origin: origins.specimens } = await serve(specimenDist).then((s) => (servers.push(s.server), s)));

for (const t of targets) t.url = (t.kind === 'page' ? origins.site : origins.specimens) + t.path;

const failures = [];
const report = {
  slug: args.slug,
  generated: new Date().toISOString(),
  browser: null,
  javaScript: false,
  widths,
  viewportHeight: HEIGHT,
  states: STATES,
  targets: [],
};

try {
  for (const t of targets) {
    const entry = { kind: t.kind, request: t.request, name: t.name, url: t.url, widths: [] };
    report.targets.push(entry);
    for (const width of widths) {
      // A browser call that never returns fails the run instead of hanging it.
      const watchdog = setTimeout(() => fail(`${t.kind} ${t.request} at ${width}px: no result after ${WATCHDOG_S}s`), WATCHDOG_S * 1000);
      try {
        const shot = await shoot(t, width);
        entry.widths.push(shot);
        // Fonts and state-only images (a :hover background) load after the first check; any that failed fail the run.
        if (shot.brokenAssets.length) failures.push(`${t.kind} ${t.request} at ${width}px: assets failed while capturing: ${shot.brokenAssets.join(', ')}`);
      } catch (e) {
        failures.push(`${t.kind} ${t.request} at ${width}px: ${e.message.split('\n')[0]}`);
        entry.widths.push({ width, error: e.message.split('\n')[0] });
      } finally {
        clearTimeout(watchdog);
      }
    }
  }
} finally {
  for (const s of servers) s.close();
}

const reportPath = join(shotsDir, 'report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

console.log('\nqa-shots: output');
for (const t of report.targets) {
  for (const w of t.widths) {
    if (w.error) continue;
    console.log(`  ${w.screenshot}`);
    const n = w.elements.length;
    if (n) console.log(`  ${rel(join(repo, w.statesDir))}/  (${n} element${n === 1 ? '' : 's'} x ${STATES.length} states)`);
  }
}
console.log(`  ${rel(reportPath)}`);
const warnings = report.targets.flatMap((t) => t.widths.flatMap((w) => (w.warnings ?? []).map((x) => `${t.name} at ${w.width}px: ${x}`)));
if (warnings.length) console.log(`\nqa-shots: ${warnings.length} warning(s), also in the report:\n  ${warnings.join('\n  ')}`);
if (failures.length) fail(`${failures.length} failed:\n  ${failures.join('\n  ')}`);

// One page or specimen at one width, in a fresh profile so no earlier visit shows as :visited. Visited links
// only render in full Chromium (channel "chromium") with a persistent profile, not in the headless shell.
async function shoot(t, width) {
  const profile = mkdtempSync(join(tmpdir(), 'qa-shots-'));
  let ctx;
  try {
    ctx = await chromium.launchPersistentContext(profile, {
      channel: 'chromium',
      javaScriptEnabled: false,
      viewport: { width, height: HEIGHT },
      deviceScaleFactor: 1,
      colorScheme: 'light',
      serviceWorkers: 'block',
    });
  } catch (e) {
    rmSync(profile, { recursive: true, force: true });
    if (/Executable doesn't exist|browserType\.launch.*install/s.test(e.message)) {
      fail(`Playwright's Chromium is not installed; run make qa-browser-install`);
    }
    throw e;
  }
  report.browser ??= `chromium ${ctx.browser()?.version() ?? ''}`.trim();
  const origin = new URL(t.url).origin;
  const external = new Set();
  const broken = [];
  // Offline: nothing leaves localhost. A link that navigates off-site gets a stub page (so it can be visited).
  await ctx.route('**/*', (route) => {
    const req = route.request();
    if (req.url().startsWith(origin + '/')) return route.continue();
    if (req.isNavigationRequest()) return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
    external.add(req.url());
    return route.abort();
  });

  const dir = join(shotsDir, t.name, String(width));
  const statesDir = join(dir, 'states');
  mkdirSync(statesDir, { recursive: true });
  const warnings = [];
  try {
    const page = ctx.pages()[0] ?? (await ctx.newPage());
    // Same-origin assets that fail, keyed by the document that asked for them: the visited pass opens other pages
    // (their assets are theirs, not this page's), a download link aborts its navigation, and leaving a page aborts
    // whatever it was still loading. None of those is this page failing to render.
    // Keyed by the top-level page when the event fires, so an iframe's assets belong to the page that embeds it.
    const docOf = () => page.mainFrame().url().split('#')[0];
    // The page's own navigations are checked by goto (and a download link aborts one); an iframe's document is an asset.
    const pageNav = (req) => req.isNavigationRequest() && req.frame() === page.mainFrame();
    page.on('response', (r) => {
      const req = r.request();
      if (!pageNav(req) && r.url().startsWith(origin + '/') && r.status() >= 400) broken.push({ doc: docOf(), what: `${r.status()} ${r.url()}` });
    });
    page.on('requestfailed', (req) => {
      const error = req.failure()?.errorText ?? 'failed';
      if (!pageNav(req) && error !== 'net::ERR_ABORTED' && req.url().startsWith(origin + '/')) broken.push({ doc: docOf(), what: `${error} ${req.url()}` });
    });
    let final;
    const brokenHere = () => [...new Set(broken.filter((b) => b.doc === final).map((b) => b.what))];

    const cdp = await ctx.newCDPSession(page);
    const load = async () => {
      const res = await page.goto(t.url, { waitUntil: 'load' });
      await page.mouse.move(0, 0);
      return res;
    };
    const res = await load();
    const chain = [];
    for (let r = res?.request(); r; r = r.redirectedFrom()) chain.unshift(r.url());
    if (!res || res.status() !== 200) throw new Error(`${t.url} answered ${res ? res.status() : 'nothing'} (must be 200)`);
    final = page.url().split('#')[0];
    if (brokenHere().length) throw new Error(`the page did not render: ${brokenHere().join(', ')}`);

    const screenshot = join(dir, 'page.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    const scroll = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));

    const elements = await page.evaluate(collect, INTERACTIVE);
    const loc = (e) => page.locator(e.selector);
    const file = (i, state) => join(statesDir, `${String(i + 1).padStart(2, '0')}-${state}.png`);
    const out = (p) => rel(p);
    for (const e of elements) e.states = Object.fromEntries(STATES.map((s) => [s, null]));

    // A viewport corner the element doesn't cover (as it's scrolled now), or undefined when it covers all four.
    const corners = [{ x: 1, y: 1 }, { x: width - 2, y: 1 }, { x: 1, y: HEIGHT - 2 }, { x: width - 2, y: HEIGHT - 2 }];
    const awayFrom = (e) => loc(e).evaluate((el, pts) => pts.find((p) => !el.contains(document.elementFromPoint(p.x, p.y))), corners);

    // An element's state image: its box plus PAD, clipped to the viewport after scrolling it into view. With
    // `park`, the mouse is first moved off the element, so a rest or visited image never shows it hovered.
    const snap = async (e, path, { park = false } = {}) => {
      const l = loc(e);
      await l.scrollIntoViewIfNeeded({ timeout: 2000 });
      if (park) {
        // A corner off the element, or else outside the viewport; warn only if it still matches :hover.
        const away = (await awayFrom(e)) ?? { x: -1, y: -1 };
        await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...away, button: 'none' });
        if (await l.evaluate((el) => el.matches(':hover'))) {
          warnings.push(`${e.selector} is still under the mouse wherever it's parked: its ${basename(path, '.png').slice(3)} image may show hover`);
        }
      }
      const b = await l.boundingBox();
      if (!b) throw new Error('no box');
      const x = Math.max(0, Math.floor(b.x - PAD));
      const y = Math.max(0, Math.floor(b.y - PAD));
      const w = Math.min(width, Math.ceil(b.x + b.width + PAD)) - x;
      const h = Math.min(HEIGHT, Math.ceil(b.y + b.height + PAD)) - y;
      if (w <= 0 || h <= 0) throw new Error('outside the viewport');
      await page.screenshot({ path, clip: { x, y, width: w, height: h } });
      return out(path);
    };
    const attempt = async (e, state, fn) => {
      try {
        e.states[state] = await fn();
      } catch (err) {
        e.states[state] = `not captured: ${err.message.split('\n')[0]}`;
        warnings.push(`${e.selector} ${state} ${e.states[state]}`);
      }
    };
    const shown = elements.filter((e) => e.rendered);
    for (const e of elements) if (!e.rendered) for (const s of STATES) e.states[s] = 'not rendered';

    // rest, then hover and active (pressed, released away from the element so nothing is clicked).
    for (const e of shown) await attempt(e, 'rest', () => snap(e, file(e.index, 'rest'), { park: true }));
    for (const e of shown) {
      await attempt(e, 'hover', async () => {
        await loc(e).hover({ timeout: 2000 });
        return snap(e, file(e.index, 'hover'));
      });
      // Pressed through CDP and released at a viewport corner that isn't on the element, with no move in between:
      // a held move over a link starts a drag, which Playwright's mouse waits on forever with JavaScript off, and a
      // release on the element (or inside it) clicks it. If the page navigates anyway, it's reloaded and flagged.
      await attempt(e, 'active', async () => {
        await loc(e).scrollIntoViewIfNeeded({ timeout: 2000 });
        const away = await awayFrom(e);
        // Pressed at the centre of its first line box: a wrapped link's union box can centre on the text between
        // its lines. Pressing a point the element doesn't own would press (and could follow) something else.
        const target = await loc(e).evaluate((el) => {
          const f = [...el.getClientRects()].find((r) => r.width > 0 && r.height > 0);
          if (!f) return { miss: 'no line box' };
          const p = { x: f.x + f.width / 2, y: f.y + f.height / 2 };
          const hit = document.elementFromPoint(p.x, p.y);
          if (el.contains(hit)) return p;
          const name = !hit ? 'nothing' : hit.id ? `#${hit.id}` : hit.localName;
          return { miss: `the press point hits ${name}, not the element (covered, or pointer-events: none)` };
        });
        if (target.miss) throw new Error(target.miss);
        const at = { ...target, button: 'left', clickCount: 1 };
        const before = page.url();
        await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...at, button: 'none' });
        await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...at });
        try {
          return await snap(e, file(e.index, 'active'));
        } finally {
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...at, ...(away ?? { x: -1, y: -1 }) });
          // With no corner free of the element it's released outside the viewport; if that still clicks, the navigation
          // commits after the event.
          if (!away) await page.waitForURL((u) => u.href !== before, { timeout: 3000 }).catch(() => {});
          await page.waitForLoadState('load');
          if (page.url() !== before) {
            warnings.push(`${e.selector} active: releasing the mouse followed the link (it covers every viewport corner); page reloaded`);
            await load();
          }
        }
      });
    }

    // focus-visible, reached the way a keyboard user reaches it: Tab from the top of a fresh load.
    await load();
    const seen = new Set();
    for (let i = 0; i < elements.length + 20; i++) {
      await page.keyboard.press('Tab');
      // index into the same query as collect(); -1 when focus is on something else, null on the body (wrapped)
      const active = await page.evaluate(
        (q) => (document.activeElement === document.body ? null : [...document.querySelectorAll(q)].indexOf(document.activeElement)),
        INTERACTIVE,
      );
      if (active === null && seen.size) break;
      if (active === null || active < 0 || seen.has(active)) continue;
      seen.add(active);
      const e = elements[active];
      e.tabOrder = seen.size;
      await attempt(e, 'focus-visible', async () => {
        const visible = await page.evaluate(() => document.activeElement.matches(':focus-visible'));
        const path = await snap(e, file(e.index, 'focus-visible'));
        if (!visible) warnings.push(`${e.selector} took focus by Tab but does not match :focus-visible`);
        return path;
      });
    }
    for (const e of shown) if (!e.states['focus-visible']) e.states['focus-visible'] = 'not reached by Tab';

    // visited: follow each link by keyboard (Enter), come back, then shoot all links on a fresh load.
    const links = shown.filter((e) => e.href && /^https?:/.test(e.href));
    for (const e of shown) if (!links.includes(e)) e.states.visited = e.href ? 'not applicable (not an http link)' : 'not applicable (not a link)';
    for (const e of links) {
      const here = new URL(page.url());
      const there = new URL(e.href);
      if (there.href === here.href) continue; // already in history: this page
      try {
        await loc(e).evaluate((el) => el.removeAttribute('target'));
        await loc(e).focus({ timeout: 2000 });
        await Promise.all([page.waitForURL((u) => u.href !== here.href, { timeout: 5000 }), page.keyboard.press('Enter')]);
      } catch (err) {
        e.states.visited = `not captured: could not follow the link (${err.message.split('\n')[0]})`;
        warnings.push(`${e.selector} visited ${e.states.visited}`);
      }
      await load();
    }
    await load();
    for (const e of links) if (!e.states.visited) await attempt(e, 'visited', () => snap(e, file(e.index, 'visited'), { park: true }));

    // Let anything the last captures started finish (or fail) before the result is read.
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    for (const e of elements) delete e.rendered;
    if (external.size) warnings.push(`blocked ${external.size} off-site request(s): ${[...external].join(', ')}`);
    return {
      width,
      requested: t.url,
      redirects: chain.slice(0, -1),
      final: page.url(),
      status: res.status(),
      screenshot: out(screenshot),
      statesDir: out(statesDir),
      horizontalScroll: scroll.scrollWidth > scroll.clientWidth,
      scrollWidth: scroll.scrollWidth,
      clientWidth: scroll.clientWidth,
      warnings,
      brokenAssets: brokenHere(),
      elements,
    };
  } finally {
    await ctx.close();
    rmSync(profile, { recursive: true, force: true });
  }
}

// In the page: every interactive element, with a selector unique in the document and its rendered size.
function collect(query) {
  const selectorOf = (el) => {
    const parts = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      if (n.id && document.querySelectorAll(`#${CSS.escape(n.id)}`).length === 1) {
        parts.unshift(`#${CSS.escape(n.id)}`);
        break;
      }
      if (n === document.documentElement) {
        parts.unshift('html');
        break;
      }
      const tag = n.localName;
      const same = [...n.parentElement.children].filter((c) => c.localName === tag);
      parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(n) + 1})` : tag);
    }
    return parts.join(' > ');
  };
  return [...document.querySelectorAll(query)].map((el, index) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    // An inline link that wraps has one box per line; its bounding box is their union, so the target check
    // uses the smallest line box (qa.md item 76 measures the target a pointer can hit).
    const round = (n) => Math.round(n * 100) / 100;
    const fragments = [...el.getClientRects()].filter((f) => f.width > 0 && f.height > 0).map((f) => ({ width: round(f.width), height: round(f.height) }));
    return {
      index,
      selector: selectorOf(el),
      tag: el.localName,
      role: el.getAttribute('role'),
      text: (el.innerText || el.getAttribute('aria-label') || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      href: el.href ? String(el.href) : null,
      width: round(r.width),
      height: round(r.height),
      fragments,
      atLeast24x24: fragments.length > 0 && fragments.every((f) => f.width >= 24 && f.height >= 24),
      rendered: r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none',
    };
  });
}
