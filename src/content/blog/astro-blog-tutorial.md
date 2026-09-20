---
title: Atom 博客的技术架构解析
description: 从 Astro 内容集合、构建流水线、GitHub Pages 自动部署三个角度，拆解 Atom 博客是怎么从 Markdown 文件变成可访问的静态网站。
pubDate: 2026-09-19
category: tutorial
tags: [Astro, 架构, GitHub Pages, 部署]
---

如果你对 Atom 博客**背后的技术栈**感兴趣——它为什么能做到零 JavaScript、构建产物体积小、部署到 GitHub Pages 完全免费——这篇文章会从三个角度拆解：**Astro 内容集合**、**构建流水线**、**GitHub Pages 自动部署**。

## 一、为什么选 Astro

Astro 是一个现代静态站点生成器，与 Atom 的轻量化定位非常契合：

- **零 JavaScript 默认** —— 页面输出纯 HTML，按需加载交互脚本
- **内容优先** —— 原生支持 Markdown/MDX 内容集合，内置类型检查
- **构建快速** —— 基于 Vite，开发体验流畅
- **部署友好** —— 输出纯静态文件，GitHub Pages / Cloudflare Pages / Vercel 都能跑

整个 Atom 博客的**生产依赖只有 1 个** (`astro`)，构建产物约 700KB，单页 HTML 7-20KB。

## 二、内容集合（Content Collections）

Astro 的内容集合提供**类型安全的 Markdown 管理**。在 `src/content.config.ts` 定义 schema：

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    featuredImage: z.string().optional(),
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
    reward: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog };
```

文章必须严格遵守 schema，否则**构建时立即报错**——这比运行时发现要好得多。

## 三、构建流水线

`npm run build` 的实际流程（按顺序）：

```
1. 主题扫描      (src/themes/ → src/generated/themes.css + themes.ts)
2. 预压缩 app.js (public/js/app.js via esbuild)
3. Astro build   (Markdown → HTML, 生成静态文件到 dist/)
4. postbuild:
   - generate-rss.mjs   (生成 RSS Feed + 搜索索引)
   - fix-sitemap.mjs    (用真实 updatedDate 替换构建时间)
   - 复制 dist/Atom/js/app.js 到 dist/  (GitHub Pages 子路径)
```

`theme-loader.mjs` 这个 Astro 插件是关键——它**构建时**扫描 `src/themes/` 目录，自动生成主题清单和 CSS 入口，让第三方开发者添加主题时**零配置**。

## 四、GitHub Actions 自动部署

`.github/workflows/deploy.yml` 配置：

```yaml
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          DEPLOY_TARGET: github    # 触发 base='/repo-name' 子路径模式
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    environment:
      name: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

`astro.config.mjs` 检测 `DEPLOY_TARGET=github` 环境变量，自动设置 `base='/Atom'`，所有 HTML 中的链接自动加前缀。

## 五、子路径部署的坑

GitHub Pages 把 `dist/` 整个目录服务在 `https://<user>.github.io/Atom/` 下，**不是根目录**。

这意味着：
- ✅ HTML 中写 `/Atom/blog/foo/` → 实际访问 `dist/blog/foo/index.html` → 200
- ❌ 但 `public/js/app.js` 默认会复制到 `dist/js/app.js`，**不在子路径下**
- ❌ HTML 引用 `/Atom/js/app.js` → 404

**解决方法**：在 `scripts/minify-app-js.mjs` 里**预先**把 `public/js/app.js` 复制到 `public/Atom/js/app.js`，Astro build 时会一并复制到 `dist/Atom/js/app.js`。这也是为什么 build 必须分成两步（先 minify，再 build）。

## 六、进一步学习

- 📖 [Astro 官方文档](https://docs.astro.build)
- 📖 [Content Collections 指南](https://docs.astro.build/en/guides/content-collections/)
- 📖 [GitHub Pages 部署](https://docs.astro.build/en/guides/deploy/github/)
- 📖 [Markdown 语法参考](https://commonmark.org/)
- 🎨 [Atom 博客](https://zz3656.github.io/Atom) — 上面所有理念的实际应用