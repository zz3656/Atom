---
title: 用 Astro 搭建你的第一个博客
description: 从零开始，手把手教你用 Astro 搭建一个现代、快速的个人博客，并部署到 GitHub Pages。
pubDate: 2026-05-01
tags: [Astro, 教程, 博客]
---

## 为什么选择 Astro？

在众多静态站点生成器中，Astro 凭借几个独特的优势脱颖而出：

- **零 JavaScript 默认** — 页面输出纯 HTML，只有需要交互时才加载 JS
- **内容优先** — 原生支持 Markdown/MDX 内容集合
- **组件灵活** — 可以混用 React、Vue、Svelte 等框架组件
- **构建极快** — 基于 Vite，开发体验丝滑

## 快速开始

### 创建项目

```bash
npm create astro@latest my-blog
```

选择 Blog 模板，Astro 会自动生成基础结构。

### 项目结构

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

### 写第一篇文章

在 `src/content/blog/` 创建 `.md` 文件：

```markdown
---
title: 我的第一篇文章
description: Hello World！
pubDate: 2026-05-01
tags: [随笔]
---

这是正文内容，支持完整的 Markdown 语法！
```

Frontmatter 中的字段会自动类型检查，写错了 IDE 会提示。

## 部署到 GitHub Pages

### 1. 创建仓库

在 GitHub 创建新仓库，比如 `my-blog`。

### 2. 配置 GitHub Actions

在 `.github/workflows/deploy.yml` 添加：

```yaml
name: Deploy
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
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

### 3. 启用 Pages

在仓库 Settings → Pages → Source 选择 **GitHub Actions**。

推送代码后，GitHub 会自动构建部署。🎉

## 性能对比

| 框架 | 构建时间 | 输出大小 | Lighthouse |
|------|---------|---------|------------|
| Astro | ~2s | ~50KB | 100/100 |
| Next.js | ~8s | ~200KB | 95/100 |
| Hexo | ~5s | ~100KB | 90/100 |

> Astro 的 "零 JS" 策略让它默认就能拿到满分 Lighthouse。

## 总结

Astro 是目前最适合内容类网站的框架。如果你的需求是博客、文档站、作品集，强烈推荐试试 Astro！

> 💡 **提示**：访问 [astro.build](https://astro.build) 获取更多主题和组件。
