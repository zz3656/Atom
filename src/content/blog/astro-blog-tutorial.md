---
title: 用 Astro 搭建你的第一个博客
description: 从零开始了解 Astro 的核心理念、目录约定、Markdown 内容集合、主题系统，以及如何把它部署到 GitHub Pages。
pubDate: 2026-09-19
category: tutorial
tags: [Astro, 教程, 博客, GitHub Pages]
---

## 为什么选择 Astro

Astro 是一个现代静态站点生成器，以下特点让它很适合内容类网站：

- **零 JavaScript 默认** —— 页面输出纯 HTML，按需加载交互脚本
- **内容优先** —— 原生支持 Markdown/MDX 内容集合，内置类型检查
- **构建快速** —— 基于 Vite，开发体验流畅
- **部署友好** —— 输出纯静态文件，GitHub Pages / Cloudflare Pages / Vercel 都能跑

## 快速开始

### 创建项目

```bash
npm create astro@latest my-blog
cd my-blog
npm install
npm run dev   # http://localhost:4321
```

### 目录结构

```
my-blog/
├── src/
│   ├── content/blog/   # Markdown 文章
│   ├── layouts/        # 页面布局
│   ├── pages/          # 路由页面
│   └── styles/         # 样式文件
├── public/             # 静态资源
└── astro.config.mjs    # 配置文件
```

## 内容集合（Content Collections）

Astro 的内容集合提供 **类型安全的 Markdown** 管理。在 `src/content.config.ts` 定义 schema：

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
```

然后在文章 frontmatter 里严格遵守 schema，否则构建时报错。

## 静态生成

所有页面在构建时预渲染（SSG），没有运行时数据库。内容变更后重新构建即可。

## 主题系统（如果你的博客支持）

Astro 本身不强制主题方案，但你可以：

- 用 CSS 变量定义设计 token
- 在 `astro.config.mjs` 集成 Tailwind / UnoCSS
- 用 `<style>` 块做组件级样式

## 部署到 GitHub Pages

1. 推送代码到 GitHub 仓库
2. 进入 Settings → Pages → Source 选 **GitHub Actions**
3. 设置 Workflow permissions 为 Read and write
4. 推送代码，自动部署

GitHub Actions 配置示例（`.github/workflows/deploy.yml`）：

```yaml
name: Deploy to GitHub Pages
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
          DEPLOY_TARGET: github
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

## 进一步学习

- 📖 [Astro 官方文档](https://docs.astro.build)
- 📖 [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- 📖 [Markdown 语法参考](https://commonmark.org/)
- 🎨 [Atom 博客](https://zz3656.github.io/Atom) — 基于以上所有理念的实际项目