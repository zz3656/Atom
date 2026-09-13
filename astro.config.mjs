import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // site: 'https://zz3656.github.io/atom-blog',  // 取消注释后部署到 GitHub Pages
  // base: '/atom-blog',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
