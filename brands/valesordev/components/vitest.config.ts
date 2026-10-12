/// <reference types="vitest/config" />
// Render tests for the Valesor components (ADR 0001 §8): Vitest with Astro's Container API.
// Run by `make test-brand-valesordev` (`vitest run --root brands/valesordev/components`).
// The dev toolbar is off so rendered HTML carries no absolute source paths.
import { getViteConfig } from 'astro/config';

export default getViteConfig(
  {
    test: {
      include: ['__tests__/**/*.test.ts'],
    },
  },
  { devToolbar: { enabled: false } },
);
