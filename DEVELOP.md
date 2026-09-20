# 开发者指南 · Developer Guide

> Atom 的详细开发文档。适合想 Fork、二次开发或贡献代码的开发者。

> Detailed development docs for Atom. For those who want to fork, customize, or contribute.

---

## 📖 目录 / Table of Contents

- [项目概览](#项目概览)
- [技术选型](#技术选型)
- [快速上手](#快速上手)
- [文件结构详解](#文件结构详解)
- [文章管理](#文章管理)
- [主题定制](#主题定制)
- [高级功能](#高级功能)
- [部署指南](#部署指南)
- [常见问题](#常见问题)
- [Contributing](#contributing)

---

## 项目概览

### 中文

Atom 是一个**轻量级、零依赖**的静态博客，使用 [Astro](https://astro.build) 构建，专为 GitHub Pages 部署优化。项目灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量。

**核心设计理念：**

- **快** — 零 JavaScript 输出，Lighthouse 满分
- **简** — 无后端、无数据库、无构建依赖
- **全** — SEO 开箱即用：RSS、Sitemap、JSON-LD、Open Graph

### English

Atom is a **lightweight, zero-dependency** static blog built with [Astro](https://astro.build), optimized for GitHub Pages deployment. Inspired by Atom, the boxing robot from _Real Steel_ — compact, precise, full of power.

**Core design philosophy:**

- **Fast** — Zero JavaScript output, Lighthouse 100
- **Simple** — No backend, no database, no build dependencies
- **Complete** — SEO out of the box: RSS, Sitemap, JSON-LD, Open Graph

---

## 技术选型

### 中文

| 层            | 技术                     | 原因                                       |
| ------------- | ------------------------ | ------------------------------------------ |
| 框架          | Astro 7.x                | 零 JS 默认输出，Content Collections Schema |
| 语言          | TypeScript               | 类型安全，编辑器提示                       |
| 样式          | 原生 CSS + CSS Variables | 无框架依赖，暗黑模式轻松实现               |
| 代码高亮      | Shiki                    | 内置 Astro，支持 GitHub Dark 主题          |
| RSS / Sitemap | 自定义 postbuild 脚本    | 零 npm 依赖，构建后自动生成                |
| 部署          | GitHub Pages + Actions   | 免费、自动化                               |

### English

| Layer            | Technology                 | Reason                                     |
| ---------------- | -------------------------- | ------------------------------------------ |
| Framework        | Astro 7.x                  | Zero JS output, Content Collections Schema |
| Language         | TypeScript                 | Type safety, IDE hints                     |
| Styling          | Native CSS + CSS Variables | No framework dependency, easy dark mode    |
| Syntax Highlight | Shiki                      | Built-in Astro, GitHub Dark theme support  |
| RSS / Sitemap    | Custom postbuild script    | Zero npm deps, auto-generated post-build   |
| Hosting          | GitHub Pages + Actions     | Free, automated                            |

---

## 快速上手

### 中文

```bash
# 1. 克隆
git clone https://github.com/zz3656/Atom.git
cd Atom

# 2. 安装依赖
npm install

# 3. 本地开发 (http://localhost:4321)
npm run dev

# 4. 构建
npm run build

# 5. 预览构建结果
npm run preview
```

### English

```bash
# 1. Clone
git clone https://github.com/zz3656/Atom.git
cd Atom

# 2. Install dependencies
npm install

# 3. Local dev (http://localhost:4321)
npm run dev

# 4. Build
npm run build

# 5. Preview the build
npm run preview

# 6. Type check + tests + build verification
npm run check   # TypeScript strict type check
npm run test    # Vitest unit tests
npm run build   # Full build with all post-processing
```

---

## 文件结构详解

### 中文

```
Atom/
├── scripts/                   # 构建辅助脚本
│   ├── atom-cli.mjs           # 本地 CLI（创建/列出文章）
│   ├── create-theme.mjs       # 主题脚手架（npm run theme:create <id>）
│   ├── generate-rss.mjs       # RSS Feed + 搜索索引生成
│   ├── fix-sitemap.mjs        # sitemap lastmod 修正
│   ├── minify-app-js.mjs      # app.js 压缩 + 子路径兼容
│   └── convert-hexo.mjs       # Hexo 迁移工具（可选用）
├── astro-plugins/
│   ├── remark-img-lazy.mjs    # Markdown 图片自动加 lazy loading
│   └── theme-loader.mjs       # 构建时扫描 src/themes/，生成 CSS 入口
├── public/                    # 静态资源（原样复制到 dist/）
│   ├── favicon.svg            # 网站图标
│   ├── manifest.json          # PWA 配置
│   ├── robots.txt             # 搜索引擎爬虫规则
│   ├── logos/                  # 导航栏 Logo 占位
│   └── medias/reward/         # 打赏二维码（可选）
│       ├── wechat.png
│       └── alipay.png
├── src/
│   ├── themes/                # 主题目录（默认 atom-default）
│   │   └── atom-default/      # 自带主题：light + dark
│   ├── components/            # Astro 组件
│   │   ├── Header.astro       # 导航栏 + 日/夜间切换
│   │   ├── Footer.astro       # 页脚 + 社交链接
│   │   ├── PostCard.astro     # 文章卡片（标题、日期、分类、标签）
│   │   ├── TableOfContents.astro # 文章目录（桌面浮动 + 移动折叠）
│   │   ├── HeroIcon.astro     # 首页 Hero 图标
│   │   └── FormattedDate.astro # 日期格式化组件
│   ├── layouts/               # 页面布局
│   │   ├── BaseLayout.astro   # 全局布局（head, nav, footer, 内联主题脚本）
│   │   └── BlogPost.astro     # 文章布局（含 TOC、prev/next、打赏、JSON-LD）
│   ├── pages/                 # 路由页面
│   │   ├── index.astro        # / → 首页
│   │   ├── about.astro        # /about → 关于页
│   │   ├── 404.astro          # /404 → 404 页
│   │   ├── blog/              # 文章列表 & 详情
│   │   ├── categories/        # 分类列表
│   │   ├── category/          # 分类详情
│   │   ├── tags/              # 标签列表
│   │   └── tag/               # 标签详情
│   ├── content/               # 📝 Markdown 文章
│   │   └── blog/              # 文章目录（每篇一个 .md）
│   ├── styles/                # 样式模块
│   │   ├── global.css         # 主入口（@import 所有模块）
│   │   └── _modules/          # 22 个 CSS 模块（按钮/导航/TOC/...）
│   ├── utils/                 # 工具函数
│   │   ├── path.ts            # URL/base 路径处理
│   │   ├── blog.ts            # 文章数据工具
│   │   ├── date.ts            # 日期格式化
│   │   ├── collection.ts      # Content Collections 公共逻辑
│   │   ├── themes.ts          # 主题 manifest 校验
│   │   └── markdown-strip.ts  # Markdown → 纯文本（提取摘要/搜索）
│   ├── consts.ts              # 站点配置（SITE_TITLE / REPO_URL / SOCIAL_LINKS）
│   └── env.d.ts
├── tests/                     # 单元测试（Vitest）
│   ├── app.behavior.test.ts   # 主题切换/搜索/复制 等交互
│   ├── app.dom.test.ts        # DOM 操作
│   ├── blog.test.ts           # 文章数据工具
│   ├── collection.test.ts     # getPublishedPosts
│   ├── date.test.ts           # 日期格式化
│   ├── path.test.ts           # URL 路径
│   └── themes.test.ts         # 主题 manifest 校验
├── docs/
│   └── THEMING.md             # 主题开发指南（第三方主题用）
├── astro.config.mjs           # Astro 配置（含 base 自动检测）
├── vitest.config.ts           # 测试配置
├── eslint.config.js           # ESLint 配置
├── package.json
├── tsconfig.json
└── README.md
```

### English

```
Atom/
├── scripts/                   # Build helper scripts
│   ├── atom-cli.mjs           # Local CLI (create / list articles)
│   ├── create-theme.mjs       # Theme scaffold (npm run theme:create <id>)
│   ├── generate-rss.mjs       # RSS feed + search index
│   ├── fix-sitemap.mjs        # Sitemap lastmod fix
│   ├── minify-app-js.mjs      # app.js minify + sub-path compat
│   └── convert-hexo.mjs       # Hexo migration tool (optional)
├── astro-plugins/
│   ├── remark-img-lazy.mjs    # Auto-add loading=lazy to Markdown images
│   └── theme-loader.mjs       # Build-time scan src/themes/, generate CSS entry
├── public/                    # Static assets (copied to dist/)
│   ├── favicon.svg            # Site favicon
│   ├── manifest.json          # PWA config
│   ├── robots.txt             # Search engine crawler rules
│   └── medias/reward/         # Reward QR codes (optional)
│       ├── wechat.png
│       └── alipay.png
├── src/
│   ├── themes/                # Themes directory (default: atom-default)
│   │   └── atom-default/      # Built-in theme: light + dark
│   ├── components/            # Astro components
│   │   ├── Header.astro       # Navbar + light/dark toggle
│   │   ├── Footer.astro       # Footer + social links
│   │   ├── PostCard.astro     # Article card (title, date, category, tags)
│   │   ├── TableOfContents.astro # Article TOC (desktop floating + mobile collapsible)
│   │   ├── HeroIcon.astro     # Homepage hero icon
│   │   └── FormattedDate.astro # Date formatter
│   ├── layouts/               # Page layouts
│   │   ├── BaseLayout.astro   # Global layout (head, nav, footer, inline theme script)
│   │   └── BlogPost.astro     # Article layout (TOC, prev/next, reward, JSON-LD)
│   ├── pages/                 # Route pages
│   │   ├── index.astro        # / → Homepage
│   │   ├── about.astro        # /about → About page
│   │   ├── 404.astro          # /404 → 404 page
│   │   ├── blog/              # Article list & detail
│   │   ├── categories/        # Category list
│   │   ├── category/          # Category detail
│   │   ├── tags/              # Tag list
│   │   └── tag/               # Tag detail
│   ├── content/               # 📝 Markdown articles
│   │   └── blog/              # One .md per article
│   ├── styles/                # Style modules
│   │   ├── global.css         # Main entry (@import all modules)
│   │   └── _modules/          # 22 CSS modules (buttons/nav/TOC/...)
│   ├── utils/                 # Utility functions
│   │   ├── path.ts            # URL / base path
│   │   ├── blog.ts            # Article data tools
│   │   ├── date.ts            # Date formatting
│   │   ├── collection.ts      # Content Collections helpers
│   │   ├── themes.ts          # Theme manifest validation
│   │   └── markdown-strip.ts  # Markdown → plain text (for search / summary)
│   ├── consts.ts              # Site config (SITE_TITLE / REPO_URL / SOCIAL_LINKS)
│   └── env.d.ts
├── tests/                     # Unit tests (Vitest)
│   ├── app.behavior.test.ts   # Theme toggle / search / copy interactions
│   ├── app.dom.test.ts        # DOM operations
│   ├── blog.test.ts           # Article data tools
│   ├── collection.test.ts     # getPublishedPosts
│   ├── date.test.ts           # Date formatting
│   ├── path.test.ts           # URL paths
│   └── themes.test.ts         # Theme manifest validation
├── docs/
│   └── THEMING.md             # Theme development guide (for third parties)
├── astro.config.mjs           # Astro config (auto-detect base)
├── vitest.config.ts           # Test config
├── eslint.config.js           # ESLint config
├── package.json
├── tsconfig.json
└── README.md
```

---

## 文章管理

### 创建文章

在 `src/content/blog/` 下新建 `.md` 文件：

```markdown
---
title: 文章标题
description: 简短描述
pubDate: 2026-01-01
tags: [标签1, 标签2]
heroImage: /images/cover.jpg
updatedDate: 2026-01-02
reward: true
---

正文内容...
```

### Frontmatter 字段

| 字段          | 类型       | 必填 | 说明                         |
| ------------- | ---------- | ---- | ---------------------------- |
| `title`       | `string`   | ✅   | 文章标题                     |
| `description` | `string`   | ✅   | 卡片描述（约 1-2 行）        |
| `pubDate`     | `date`     | ✅   | 发布日期                     |
| `tags`        | `string[]` | ❌   | 标签列表                     |
| `heroImage`   | `string`   | ❌   | 封面图片（相对于 `public/`） |
| `updatedDate` | `date`     | ❌   | 更新日期（可选）             |
| `reward`      | `boolean`  | ❌   | 显示打赏码（默认 `false`）   |

### 添加封面图片

将图片放入 `public/` 目录，在 frontmatter 中引用：

```markdown
heroImage: /images/cover.jpg
```

图片会自动复制到 `dist/`。

---

## 主题定制

### 中文

#### 修改主题配色（推荐）

编辑主题文件 `src/themes/atom-default/light.css` 和 `dark.css`，调整 CSS 变量：

```css
/* src/themes/atom-default/light.css */
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #1a1a2e;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
}
```

```css
/* src/themes/atom-default/dark.css */
html[data-theme='atom-default'][data-mode='dark'] {
  --bg-primary: #0f0f1a;
  --text-primary: #e2e8f0;
  --accent: #818cf8;
}
```

**完整 token 列表**（background / text / border / accent / tag / category / semantic / shadow）见 [docs/THEMING.md](./docs/THEMING.md)。

如果只是想覆盖**整个主题**（换一套配色），可以新建自己的主题目录：
```bash
npm run theme:create ocean
# 编辑 src/themes/ocean/light.css + dark.css
```

#### 修改布局 token（圆角/字体/宽度）

编辑 `src/styles/_modules/_variables.css`（**不在主题 CSS 里**）：

```css
:root {
  --radius: 12px;
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### 修改字体

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-serif: 'Noto Serif SC', 'Source Serif Pro', serif;
}
```

#### 修改站点信息

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = '你的博客名';        // SEO/OG/RSS 标题
export const SITE_NAME = 'MyBlog';              // 导航栏短名
export const SITE_DESCRIPTION = '你的博客描述'; // meta description
export const AUTHOR = '你的名字';

export const SITE_LOGO = '/logos/logo.svg';
export const SITE_FAVICON = '/favicon.svg';

// 首页 Hero 区域（图标 + 标题 + 描述 + 按钮）可完全客制化
export const SITE_HERO_ICON = '';               // 留空使用内置 Atom 原子 SVG
export const HERO_TITLE = 'MyBlog';             // Hero 标题文本（允许内嵌 HTML）
export const HERO_DESCRIPTION = '你的博客描述';
export const HERO_ACTIONS = [
  { label: '开始阅读 →', href: '/blog', variant: 'primary' },
  { label: '关于此站', href: '/about', variant: 'secondary' },
];

export const REPO_URL = 'https://github.com/你的用户名/你的仓库';
// ↑ Footer "Atom" 链接指向这里

export const SOCIAL_LINKS = {
  github: 'https://github.com/你的用户名', // 用户可定制（Footer 🐙）
  twitter: '',
  email: '',
};
```

### English

#### Change Theme Colors (recommended)

Edit theme files `src/themes/atom-default/light.css` and `dark.css`, adjust CSS variables:

```css
/* src/themes/atom-default/light.css */
html[data-theme='atom-default'][data-mode='light'] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #1a1a2e;
  --accent: #6366f1;
  --accent-hover: #4f46e5;
}
```

```css
/* src/themes/atom-default/dark.css */
html[data-theme='atom-default'][data-mode='dark'] {
  --bg-primary: #0f0f1a;
  --text-primary: #e2e8f0;
  --accent: #818cf8;
}
```

For the **full token list** (background / text / border / accent / tag / category / semantic / shadow), see [docs/THEMING.md](./docs/THEMING.md).

To replace the **entire theme** with a different palette, create your own theme directory:
```bash
npm run theme:create ocean
# Edit src/themes/ocean/light.css + dark.css
```

#### Change Layout Tokens (radius / fonts / width)

Edit `src/styles/_modules/_variables.css` (**not** in theme CSS):

```css
:root {
  --radius: 12px;
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### Change Fonts

```css
:root {
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### Change Site Info

Edit `src/consts.ts`:

```typescript
export const SITE_TITLE = 'Your Blog Name';  // SEO / OG / RSS title
export const SITE_NAME = 'MyBlog';           // Navbar short name
export const SITE_DESCRIPTION = '...';        // meta description
export const AUTHOR = 'Your Name';

export const SITE_LOGO = '/logos/logo.svg';
export const SITE_FAVICON = '/favicon.svg';

// Homepage Hero section (icon + title + description + buttons) is fully customizable
export const SITE_HERO_ICON = '';            // Empty -> use built-in Atom SVG
export const HERO_TITLE = 'MyBlog';          // Hero headline (HTML allowed)
export const HERO_DESCRIPTION = 'Your blog description';
export const HERO_ACTIONS = [
  { label: 'Start reading →', href: '/blog', variant: 'primary' },
  { label: 'About', href: '/about', variant: 'secondary' },
];

export const REPO_URL = 'https://github.com/yourname/yourrepo';
// ↑ Footer "Atom" link points here

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourname',     // User-customizable (Footer 🐙)
  twitter: '',
  email: '',
};
```

---

## Hexo → Atom 迁移记录

### 背景

从 Hexo (hexo-theme-matery) 迁移到 Astro 静态博客，记录转换脚本编写过程和核心规律。

### 转换脚本

- **脚本路径**: `scripts/convert-hexo.mjs`
- **文档**: `scripts/README.md`
- **来源**: `../../zz3656.github.io/source/_posts/`（Hexo 源文件）
- **目标**: `src/content/blog/`（Astro Content Collections）

### 转换规则摘要

| Hexo (matery) 字段          | Astro 字段            | 转换规则                      |
| --------------------------- | --------------------- | ----------------------------- |
| `title`                     | `title`               | 直接保留                      |
| `date: 2025-07-14 05:23:30` | `pubDate: 2025-07-14` | 只取日期                      |
| `categories` (单值/列表)    | `category`            | 列表取第一个                  |
| `tags: [- x]`               | `tags: [x]`           | YAML → inline                 |
| `summary` / `description`   | `description`         | 自动提取正文第一段（160字符） |
| `img` / `cover` / `top_img` | `heroImage`           | 统一映射，路径规范化          |

丢弃字段：`top`、`hide`、`password`、`toc`、`mathjax`、`keywords`、`reprintPolicy`、`author`、`coverImg` 及 matery 非官方字段（`swiper_index`、`top_group_index` 等）。

### 迁移统计

- 源文章: **44 篇**
- 成功转换: **44 篇**（包括中文文件名）
- 手动补充 category: **3 篇**（pvesetupistoreos.md、routeros.md、vpsikuai.md）
- 排除: welcome.md（原有）
- 详细规则见 [`scripts/README.md`](scripts/README.md)

### 参考文档

- [hexo-theme-matery 官方 Front-matter 文档](https://github.com/blinkfox/hexo-theme-matery#post-front-matter)

---

## 高级功能

### RSS / Sitemap

构建后自动生成 `dist/rss.xml` 和 `dist/sitemap.xml`。脚本位于 `scripts/generate-rss.mjs`。

自定义：编辑脚本中的 `siteUrl` 和 `repoName`。

```javascript
var siteUrl = 'https://yourdomain.com';
var repoName = 'my-blog'; // 仓库名（根站点用空字符串）
```

### 打赏功能

添加二维码图片到 `public/medias/reward/`：

```
public/medias/reward/
├── wechat.png     # 微信赞赏码
└── alipay.jpg     # 支付宝收款码
```

在文章 frontmatter 中启用：

```markdown
reward: true
```

### 集成评论

Atom 本身无后端，可通过以下方式集成评论：

1. **Cusdis** (推荐) — 开源轻量，支持 Telegram 通知
2. **Disqus** — 最成熟，但需科学上网
3. **Giscus** — 基于 GitHub Discussions

在 `src/layouts/BlogPost.astro` 的 `post-content` 后插入评论组件。

### 集成搜索

使用 Algolia DocSearch 或同类的静态搜索方案。

---

## 部署指南

### GitHub Pages（推荐）

1. 重命名 `.github_disabled/` → `.github/`
2. **Settings → Pages → Source → GitHub Actions**
3. 推送代码到 `main` 分支

### 自定义域名

1. `public/CNAME` 写入域名
2. DNS 添加 CNAME 到 `yourusername.github.io`

---

## 常见问题

### Q: 修改代码后预览没生效？

A: 确保运行的是 `npm run dev`，而非 `npm run build`。开发时使用 Vite dev server，构建后才生成静态文件。

### Q: 文章列表没有按日期排序？

A: 确保 frontmatter 的 `pubDate` 是合法的 ISO 日期格式：`2026-01-01`。

### Q: 如何添加新页面？

A: 在 `src/pages/` 下创建 `.astro` 文件即可，Astro 会自动映射为路由。

### Q: 评论系统推荐哪个？

A: **Cusdis** 最轻量且开源（`cusdis.js`），**Giscus** 如果文章在 GitHub 仓库用 Discussions。

---

## Contributing

### English

Contributions are welcome! Here's how:

1. **Fork** this repository
2. **Create** a feature branch (`git checkout -b feature/amazing`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing`)
5. **Open** a Pull Request

### 中文

欢迎贡献！贡献方式：

1. **Fork** 本项目
2. **创建** 功能分支 (`git checkout -b feature/amazing`)
3. **提交** 修改 (`git commit -m 'feat: add amazing feature'`)
4. **推送** 到分支 (`git push origin feature/amazing`)
5. **提交** Pull Request

---

<div align="center">

**Made with ⚙️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)**

</div>
