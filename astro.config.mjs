import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zz3656.github.io/atom-blog',
  base: '/atom-blog',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
