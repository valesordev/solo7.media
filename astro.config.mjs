import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://your-domain.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
