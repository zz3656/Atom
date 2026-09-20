---
title: 欢迎使用 Atom 博客
description: 你的 Atom 博客已经上线！了解它的设计理念、功能特性，以及如何快速上手写第一篇文章。
pubDate: 2026-09-18
category: guide
tags: [Atom, 入门, 博客]
---

# 欢迎来到 Atom

**Atom** 是一个基于 [Astro](https://astro.build) 构建的轻量化博客框架。灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom——**小巧、精准、充满力量**。

## 为什么选择 Atom

- **零 JavaScript 默认** —— 页面输出纯 HTML，按需加载交互脚本
- **极简依赖** —— 只有 1 个生产依赖 (`astro`)，构建产物 ~700KB
- **完整 Markdown 支持** —— 代码高亮（Shiki）、Frontmatter、自定义布局
- **开箱即用** —— RSS、Sitemap、SEO meta、阅读进度条、代码复制按钮

## 快速开始

### 创建新文章

在 `src/content/blog/` 下新建 `.md` 文件：

```markdown
---
title: 我的第一篇文章
description: 简短描述，用于 SEO 和卡片预览
pubDate: 2026-09-20
category: 随笔
tags: [标签1, 标签2]
draft: false
---

# 标题

正文内容...
```

也可以用 CLI：

```bash
npm run new        # 交互式创建
npm run list       # 列出所有文章
```

### 主题与日夜间切换

Atom 默认自带一套精心调校的紫罗兰主题，支持一键切换深色 / 浅色模式。

第三方开发者可以基于 CSS Token 体系开发新主题，详见 [THEMING.md](./THEMING.md)。

### 本地预览

```bash
npm install
npm run dev          # 开发服务器 (http://localhost:4321)
npm run build        # 生产构建 (output dist/)
npm run preview      # 预览构建产物
```

## 下一步

- 📝 看看 [Markdown 写作完全指南](/blog/markdown-guide/) 复习可用语法
- 🎨 阅读 [用 Astro 搭建你的第一个博客](/blog/astro-blog-tutorial/) 了解技术细节
- 🌐 查看 [README](https://github.com/zz3656/Atom) 了解部署与定制