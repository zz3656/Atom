import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zz3656.github.io/atom',
  base: '/atom',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
