# New Site Checklist

Steps to take after creating a repo from this template.

## Identity

- [ ] Rename `"name"` in `package.json` to match the domain (e.g. `"solo7productions.com"`)
- [ ] Set `site:` in `astro.config.mjs` to the production URL (e.g. `https://solo7productions.com`)
- [ ] Update `public/CNAME` to the custom domain

## Layout

- [ ] Update default `title` in `src/layouts/Layout.astro`
- [ ] Update site name in header/footer across `index.astro` and `about.astro`
- [ ] Add or replace `public/favicon.svg`

## Styles

- [ ] Override CSS custom properties in `src/styles/global.css` if the site uses a different color scheme

## Observability (optional)

- [ ] Add Grafana Faro instrumentation in `src/layouts/Layout.astro` if this site needs telemetry:

```js
import { initializeFaro, getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

initializeFaro({
  url: 'YOUR_FARO_ENDPOINT',
  app: { name: 'your-domain.com', version: '0.1.0', environment: 'production' },
  instrumentations: [...getWebInstrumentations(), new TracingInstrumentation()],
});
```

Add Faro to `package.json` dependencies:
```json
"@grafana/faro-web-sdk": "^1.18.1",
"@grafana/faro-web-tracing": "^1.18.1"
```

## GitHub repo settings

- [ ] Enable GitHub Pages: Settings → Pages → Source: GitHub Actions
- [ ] Set the custom domain under Settings → Pages → Custom domain
- [ ] Mark as **Template repository** if using this as the canonical template: Settings → check "Template repository"

## life.solo7.media

- [ ] Register as a submodule: `git submodule add git@github.com:valesordev/<repo>.git valesor/www.<domain>`
- [ ] Update `valesor/web-infrastructure.md` status table
- [ ] Commit the `.gitmodules` and submodule pointer

## DNS (Terraform)

- [ ] Add CNAME record in `valesor/infrastructure/` Terraform pointing domain to `valesordev.github.io`
- [ ] `terraform apply`
