import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://solo7.media',
  vite: {
    plugins: [tailwindcss()],
  },
});
