// Component specimens for rendered /brand-qa (ADR 0001 §9). Built only by `make qa-shots-valesordev`.
// Everything comes from the production config; only the source root and the output directory differ.
import { defineConfig } from 'astro/config';
import production from './astro.config.mjs';

export default defineConfig({
  ...production,
  srcDir: './specimens',
  outDir: '../../dist/qa/valesordev/specimens',
});
