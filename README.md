<div align="center">

  <svg width="72" height="72" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:1rem">
    <circle cx="16" cy="16" r="14" fill="#6366f1"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(-30 16 16)"/>
    <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="#e0e7ff" stroke-width="1.5" transform="rotate(90 16 16)"/>
    <circle cx="16" cy="16" r="2.5" fill="#fff"/>
  </svg>

# Atom

**一个用 Astro 构建的现代轻量级博客** — 像 Atom 一样强大，像钢铁一样可靠

> 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量

[![Astro](https://img.shields.io/badge/Astro-7.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🌐 在线预览](https://zz3656.github.io/Atom) · [📝 写文章](#-写文章) · [🤖 CLI 工具](#-cli-本地构建工具) · [🚀 部署](#-部署到-github-pages) · [⚙️ 自定义](#%EF%B8%8F-自定义) · [🇬🇧 English](README_EN.md) · [📘 开发者指南](DEVELOP.md) · [🔄 Hexo 转换工具](scripts/README.md)

</div>

---

## ✨ 特性

| 特性                   | 说明                                                                           |
| ---------------------- | ------------------------------------------------------------------------------ |
| ⚡ **Astro 驱动**      | 零 JS 输出，纯 HTML，加载极快                                                  |
| 🎨 **主题系统**         | 默认主题（紫罗兰 + 赛博青），一键切换深/浅色；CSS Token 体系让开发者可拓展自定义主题          |
| 📱 **响应式设计**      | 手机汉堡菜单、平板、桌面完美适配，iOS 安全区域支持                             |
| 📝 **Markdown 写作**   | 原生支持，Shiki 代码语法高亮                                                   |
| 🤖 **CLI 工具**        | `npm run new` / `npm run list` / `npm run theme:create <id>` — 本地创建文章、生成主题       |
| 📁 **分类 + 标签**     | 分类（单数）组织文章大类，标签（可多）标注细分主题                             |
| 🚀 **双平台部署**      | GitHub Actions 自动构建，支持 GitHub Pages / Cloudflare Pages                  |
| 🔍 **SEO 友好**        | 语义化 HTML、Open Graph / Twitter Card / JSON-LD 结构化数据、Sitemap、RSS 订阅 |
| 📦 **超小体积**        | 首页 HTML ~11KB gzipped（CSS 内联，无额外请求）；单篇文章 ~14KB gzipped             |
| 💯 **Lighthouse 满分** | 性能、无障碍、SEO 全 100                                                       |

---

## 🖼️ 页面预览

### 首页

- Hero 区域：Atom 原子图标（紫色渐变轨道球体）+ 渐变大标题 + 背景光晕
- 卡片网格布局：展示标题、描述、日期、分类、标签
- 右上角主题切换按钮：一键深/浅色；首次访问跟随系统设置，之后记忆用户选择

### 导航栏

- 左侧：自定义 SVG Logo + 站点名称
- 居中：导航链接（首页、文章、分类、标签、关于）
- 右侧：搜索框 + 暗黑模式切换按钮
- 页脚包含 RSS 订阅链接

### 移动端体验

- **汉堡菜单**：768px 断点自动折叠导航为抽屉式菜单，带 X 形切换动画
- **横向卡片转纵向**：文章列表在移动端自动切换为纵向卡片
- **安全区域适配**：支持 iPhone 刘海屏、底部横条等安全区域
- **触控优化**：禁用 iOS 触摸高亮、文本缩放、滚动回弹
- **字体自适应**：多断点（768px / 480px）渐进式字体缩放

### 文章页

- **居中渐变标题** → 描述 → 日期 / 更新日 → 分类 + 标签
- 阅读进度条
- 上一篇 / 下一篇导航（卡片式）

### 分类 & 标签页

- 📁 **分类列表**：紧凑标签云风格，分类名 + 文章数
- 📁 **分类详情**：列表展示该分类下所有文章
- 🏷️ **标签列表**：紧凑标签云风格，标签名 + 文章数
- 🏷️ **标签详情**：列表展示该标签下所有文章
- 所有页面标题统一为**渐变标题 + 底部发光装饰线**

### 关于页

- 统一渐变标题
- 内容居中，项目卡片网格

---

## 📁 项目结构

```
Atom/
├── scripts/
│   ├── atom-cli.mjs           # 🤖 本地 CLI（创建/列出文章）
│   ├── create-theme.mjs       # 🎨 主题脚手架（npm run theme:create <id>）
│   ├── generate-rss.mjs       # RSS Feed + 搜索索引生成
│   ├── fix-sitemap.mjs        # sitemap lastmod 修正
│   └── minify-app-js.mjs      # app.js 压缩 + 子路径兼容
├── astro-plugins/
│   └── theme-loader.mjs       # 构建时扫描 src/themes/
├── public/
│   ├── favicon.svg            # 浏览器标签页图标
│   ├── manifest.json          # PWA 支持
│   ├── robots.txt             # 搜索引擎爬虫规则
│   ├── logos/                 # 导航栏 Logo 目录
│   └── medias/reward/         # 打赏二维码（可选）
├── src/
│   ├── themes/                # 🎨 主题目录（默认 atom-default，开发者可扩展）
│   ├── components/            # Astro 组件
│   │   ├── Header.astro       # 导航栏
│   │   ├── Footer.astro       # 页脚
│   │   ├── PostCard.astro     # 文章卡片
│   │   └── ...                # 其他组件
│   ├── utils/                 # 工具函数（path/date/blog/themes/collection/markdown-strip）
│   ├── styles/                # 样式模块
│   │   ├── global.css         # 主入口
│   │   └── _modules/          # 各组件 CSS 模块
│   ├── content/               # 📝 Markdown 文章
│   │   └── blog/              # 文章目录（每篇一个 .md）
│   ├── layouts/               # 布局模板（BaseLayout / BlogPost）
│   ├── pages/                 # 路由页面
│   ├── consts.ts              # 站点配置（SITE_TITLE / REPO_URL 等）
│   └── env.d.ts
├── docs/THEMING.md            # 主题开发指南
├── astro.config.mjs
├── package.json
└── README.md
```

---

## 🤖 CLI 与 npm scripts

Atom 提供 npm scripts 与一个轻量 CLI (`scripts/atom-cli.mjs`)，体验类似 Hexo / Hugo 的本地工作流。
注意：CLI 只负责**创建/列出文章**；构建与部署由 GitHub Actions 自动完成。

### npm scripts

```bash
npm run dev             # 开发服务器（http://localhost:4321）
npm run build           # 生产构建（产物 dist/）
npm run preview         # 预览构建产物
npm test                # 运行单元测试
npm run check           # TypeScript 类型检查
npm run lint            # ESLint 检查
npm run format          # Prettier 格式化

# 内容管理
npm run new             # 交互式创建新文章
npm run list            # 列出所有文章

# 主题开发
npm run theme:create <id>  # 一键生成主题脚手架
```

### atom-cli.mjs（交互式创建）

除了上面的 npm scripts，还有一个 `scripts/atom-cli.mjs` 提供交互式创建文章体验：

| 命令                              | 说明                                 |
| --------------------------------- | ------------------------------------ |
| `new <标题>`                      | 创建新文章（交互式填写 frontmatter） |
| `new <标题> -c 分类`              | 指定分类                             |
| `new <标题> -t 标签1,标签2`       | 指定标签                             |
| `new <标题> -d 2026-01-01`        | 指定发布日期                         |
| `new <标题> -i /images/cover.jpg` | 指定封面图                           |
| `new <标题> --draft`              | 创建为草稿                           |
| `list`                            | 列出所有文章                         |

```bash
# 交互式（推荐新手）
$ npm run new

# 或一行命令
node scripts/atom-cli.mjs new "Astro 完全指南" \
  -c "技术教程" \
  -t "Astro,Blog,教程" \
  -d 2026-09-20

# 列出所有文章
npm run list
```

**注**：构建与部署由 GitHub Actions 自动完成（推送 main 分支即触发），不需要 `atom build` 之类的命令。

### 与 Hexo / Hugo 对比

| Hexo              | Hugo                             | Atom                                  |
| ----------------- | -------------------------------- | ------------------------------------- |
| `hexo new "标题"` | `hugo new content posts/标题.md` | `npm run new`（交互式）              |
| `hexo server`     | `hugo server`                    | `npm run dev`                         |
| `hexo generate && hexo deploy` | `hugo && rsync`        | `git push`（GitHub Actions 自动构建） |

---

## 🚀 快速开始

### 前置要求

- Node.js >= 22.12
- npm >= 10.8

### 1. 克隆项目

```bash
git clone https://github.com/zz3656/Atom.git
cd Atom
npm install
```

### 2. 本地开发

```bash
npm run dev
```

打开 **http://localhost:4321** 查看效果，修改文件实时热更新。

### 3. 构建预览

```bash
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建结果
```

---

## 📝 写文章

在 `src/content/blog/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 简短描述（显示在文章卡片上，建议不超过 80 字）
pubDate: 2026-09-13
category: 技术笔记 # 每篇文章一个分类
tags: [JavaScript, Astro] # 建议不超过 4 个标签，避免过长
heroImage: /images/cover.jpg # 可选：文章头部封面图
featuredImage: /images/og.jpg # 可选：SEO 专用封面图（OG / Twitter Card，1200x630）
updatedDate: 2026-09-14 # 可选：更新日期
reward: true # 可选：显示打赏码
draft: false # 可选：草稿标记（true 时不发布）
---

正文使用 Markdown 语法...
```

### Frontmatter 字段

| 字段            | 类型       | 必填 | 说明                                                                                    |
| --------------- | ---------- | ---- | --------------------------------------------------------------------------------------- |
| `title`         | `string`   | ✅   | 文章标题                                                                                |
| `description`   | `string`   | ✅   | 简短描述，显示在文章卡片（建议不超过 80 字，用户可自定义）                              |
| `pubDate`       | `date`     | ✅   | 发布日期                                                                                |
| `category`      | `string`   | ❌   | 分类名称（每篇文章只能一个）                                                            |
| `tags`          | `string[]` | ❌   | 标签列表（建议不超过 4 个，每个标签不超过 6 个字符，过长/过多会导致卡片排版错乱）       |
| `heroImage`     | `string`   | ❌   | 文章头部封面图，放在 `public/` 下                                                       |
| `featuredImage` | `string`   | ❌   | SEO 专用封面图（OG / Twitter Card）。优先于 `heroImage` 用于社交分享。尺寸建议 1200×630 |
| `updatedDate`   | `date`     | ❌   | 更新日期，显示在文章标题下方。同时作为 sitemap 的 lastmod                               |
| `reward`        | `boolean`  | ❌   | 是否在文末显示打赏码（默认关闭）                                                        |
| `draft`         | `boolean`  | ❌   | 草稿标记。`true` 时文章不会出现在列表、RSS、搜索索引中                                  |

### 样式自定义

CSS 已按功能拆分为 20 个模块（`src/styles/_modules/`），编辑对应的 `.css` 文件即可：

- `_variables.css` — 颜色变量（亮色/暗色主题）
- `_header.css` — 导航栏样式
- `_postcards.css` — 文章卡片样式
- `_responsive.css` — 响应式断点（768px / 480px）

所有样式通过 `src/styles/global.css` 入口文件统一导入。

### 导航栏

导航栏在 `src/components/Header.astro` 中配置，修改 `navLinks` 数组即可增删导航项。

### 分类 vs 标签

|      | **分类 (Category)**                      | **标签 (Tag)**                              |
| ---- | ---------------------------------------- | ------------------------------------------- |
| 数量 | 每篇文章**只能一个**                     | 每篇文章可以**多个**                        |
| 用途 | 组织文章的大类（如"技术笔记""生活随笔"） | 标注文章的细分主题（如"JavaScript""Astro"） |
| 展示 | 📁 分类列表页 + 分类详情页               | 🏷️ 标签列表页 + 标签详情页                  |
| 关系 | **相互独立**，不互相影响                 |                                             |

---

## 🚀 部署到 GitHub Pages

### 自动部署（推荐）

项目已配置 GitHub Actions，推送 `main` 分支即可自动构建部署：

1. **推送代码** 到你的 GitHub 仓库
2. 进入 **Settings → Pages → Source → 选择 GitHub Actions**
3. 进入 **Settings → Actions → General → Workflow permissions → 选择 Read and write**
4. 推送代码到 `main` 分支 ✅

> 💡 **子路径仓库**：如果仓库名为 `my-blog`，则自动部署到 `https://username.github.io/my-blog/`。

> 💡 **Cloudflare Pages**：将 Secrets 中设置 `DEPLOY_TARGET=cf`，并配置 `CF_PAGES_TOKEN`、`CF_ACCOUNT_ID`、`CF_PROJECT_NAME`。

Actions 会自动：`安装依赖 → 构建 → 部署`

### 自定义域名（可选）

1. 在 `public/` 下创建 `CNAME` 文件，写入你的域名
2. 在域名服务商处添加 CNAME 记录指向 `yourusername.github.io`

---

## ⚙️ 自定义

### 1. 站点基本信息 / Logo / Favicon

**所有站点客制化只需编辑 `src/consts.ts` 一个文件**：

```typescript
export const SITE_TITLE = '我的博客'; // 站点标题（SEO、OG、RSS、页脚等）
export const SITE_NAME = 'MyBlog'; // 导航栏显示的名称
export const SITE_DESCRIPTION = '我的个人博客'; // 站点描述（meta/og/twitter）
export const AUTHOR = '张三'; // 作者名（meta author 标签）

export const SITE_LOGO = '/logos/logo.svg'; // 导航栏 Logo 路径（对应 public/logos/logo.svg）
export const SITE_FAVICON = '/favicon.svg'; // 浏览器 Favicon 路径

export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: '',
  email: '',
};
```

> 💡 **替换 Logo 和 Favicon 各独立**：
>
> 1. **Logo**（导航栏）：放入 `public/logos/logo.svg`（支持 .svg / .png / .webp），修改 `SITE_LOGO`
> 2. **Favicon**（浏览器标签页）：放入 `public/favicon.svg`，修改 `SITE_FAVICON`
> 3. 不需要再修改任何组件代码！

### 2. 替换示例文章

仓库默认附带 3 篇示例文章（`src/content/blog/`），介绍项目功能与 Markdown / Astro 用法：

| 文件 | 用途 |
|---|---|
| `welcome.md` | 首次部署的欢迎页，可删除或替换 |
| `markdown-guide.md` | Markdown 语法参考，建议保留作为写作帮助 |
| `astro-blog-tutorial.md` | Atom 技术架构解析（不是 Astro 入门教程），可作为示例或删除 |

替换为你的内容：

```bash
# 删除示例
rm src/content/blog/welcome.md src/content/blog/astro-blog-tutorial.md

# 或用 CLI 交互式创建
npm run new
```

**前必读：** 每篇文章必须有完整的 frontmatter（`title` / `description` / `pubDate` / `category` / `tags`），否则构建失败。详见下方「📝 写文章」章节。

### 3. 部署平台

Atom 支持 **GitHub Pages** 和 **Cloudflare Pages** 两种部署方式，通过环境变量自动适配。

#### GitHub Pages（推荐）

通过 GitHub Actions 自动构建部署，只需：

1. 推送代码到 GitHub 仓库
2. 进入 **Settings → Pages → Source** 选择 **GitHub Actions**
3. 进入 **Settings → Actions → General** 设置 Workflow permissions 为 **Read and write permissions**
4. 推送代码到 `main` 分支 ✅

#### Cloudflare Pages（推荐用于国内访问）

**方式一：通过 GitHub 仓库绑定**

1. Cloudflare Dashboard → Pages → **Create a project** → **Git**
2. 连接 GitHub 仓库
3. 配置构建设置：

| 设置项                     | 值                     |
| -------------------------- | ---------------------- |
| **Framework preset**       | Astro                  |
| **Build command**          | `npm run build`        |
| **Build output directory** | `dist`                 |
| **Environment variables**  | `DEPLOY_TARGET` = `cf` |

4. 点击 **Save and Deploy**

**方式二：wrangler CLI 本地推送**

```bash
# 安装 wrangler
npm install -d wrangler

# Cloudflare Pages 模式构建
DEPLOY_TARGET=cf npm run build

# 本地部署
npx wrangler pages deploy dist
```

> 💡 **环境变量说明**：
>
> - `DEPLOY_TARGET=github` — GitHub Pages 模式（需要 `REPO_NAME`）
> - `DEPLOY_TARGET=cf` — Cloudflare Pages 模式（需要 `CF_DOMAIN`）
> - 不设置 — 自动检测，优先 GitHub Pages
> - `REPO_NAME` — GitHub Pages 子路径（默认 `Atom`，从 `${{ github.event.repository.name }}` 自动推导）
> - `CF_DOMAIN` — Cloudflare 自定义域名（默认 `atom.inte8.top`）

> ⚡ 如果默认值不满足需求，可以手动调整 `astro.config.mjs` 中的 `site` 和 `base` 字段。

```javascript
export default defineConfig({
  site: 'https://yourdomain.com', // 你的网站域名
  base: '/', // 子路径仓库填 '/your-repo-name'
  markdown: {
    shikiConfig: {
      // 自动根据暗色模式切换主题
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
```

### 3. 导航栏

导航栏项在 `src/components/Header.astro` 中配置，修改 `navLinks` 数组即可增删导航项。

布局：Logo + 站点名称在左侧，导航链接居中，搜索和主题切换在右侧。页脚已包含 RSS 订阅链接。

### 4. 页脚

Footer 展示三类信息：①用户可定制的社交链接；②自动生成的 RSS / 关于链接；③硬编码的框架品牌。

```astro
<footer class="site-footer">
  <div class="footer-content">
    <div class="footer-links">
      {/* 用户可定制：consts.ts 的 SOCIAL_LINKS.github */}
      <a href={SOCIAL_LINKS.github} title="作者 GitHub">🐙 GitHub</a>
      {/* 自动生成 */}
      <a href={rssUrl()}>📡 RSS</a>
      <a href={aboutUrl()}>👤 关于</a>
    </div>
    <p>
      © {year}
      {/* 硬编码框架品牌：与用户站点名(SITE_NAME)解耦，指向 REPO_URL */}
      <a href={REPO_URL}>{FRAMEWORK_NAME}</a>
      . Powered by <a href="https://astro.build">Astro</a>
    </p>
  </div>
</footer>
```

配置详见 `src/consts.ts`：

| 字段 | 用途 | 用户客制化？ |
|---|---|---|
| `SOCIAL_LINKS.github` | Footer 🐙 GitHub 链接 | ✅ 用户可改 |
| `REPO_URL` | 底部 "Atom" 链接，指向项目源代码仓库 | ✅ 用户必改 |
| `FRAMEWORK_NAME` | 底部 "Atom" 文字 | ❌ 硬编码框架品牌 |

### 5. 打赏二维码

二维码图片放在 `public/medias/reward/` 目录下：

```
public/medias/reward/
├── wechat.png     # 微信赞赏码（140x140 像素）
└── alipay.png     # 支付宝收款码（140x140 像素）
```

在文章 frontmatter 中设置 `reward: true` 即可在文章末尾显示打赏码。

### 6. 主题 / 换肤

Atom 自带一套精心调校的默认主题：**紫罗兰 + 赛博青**（日间紫罗兰，夜间赛博朋克青）。

右上角一键切换深色 / 浅色模式，**首次访问跟随系统设置**，之后记忆用户选择。

站点颜色全部通过 CSS 变量控制；布局/字体等变量位于 `src/styles/_modules/_variables.css`。

**拓展自定义主题**（主题系统基础设施已就绪）：

```bash
# 一键生成主题脚手架（含 manifest + 全部必需 token）
npm run theme:create ocean

# 单模式主题（不需要 dark）
npm run theme:create ocean --no-dark
```

然后编辑 `src/themes/ocean/light.css`（及 dark.css）。**默认只安装 atom-default 一个主题**；生成的第三方主题存放在 `src/themes/<id>/`，构建时自动被扫描加入。

如需在 UI 暴露主题选择菜单，开发者可自行扩展 `src/components/Header.astro`——基础设施（themes 数组 + data-theme 属性切换）已就绪。

完整开发指南（必需 token 列表、选择器约定、最佳实践）见 **[docs/THEMING.md](./docs/THEMING.md)**。

### 7. 添加新页面

在 `src/pages/` 下新建 `.astro` 文件即可自动注册路由：

```
src/pages/about.astro        → /about
src/pages/links.astro        → /links
```

---

## 📊 静态博客方案对比

| 方案               | 构建输出  | JS 依赖  | 构建时间 | SEO / RSS / Sitemap              | 学习成本     |
| ------------------ | --------- | -------- | -------- | -------------------------------- | ------------ |
| **Atom（本项目）** | **~11 KB gz** | **0**    | **~1.5s**  | **RSS/Sitemap/JSON-LD 自动生成** | 极低         |
| Hexo + Matery      | ~15 MB    | 数十个库 | ~5s      | 需插件                           | 中           |
| Hugo               | ~2 MB     | 0        | ~0.5s    | 需插件                           | 中           |
| Jekyll             | ~3 MB     | 少量     | ~3s      | 内置                             | 中           |
| Eleventy           | ~500 KB   | 0        | ~2s      | 需插件                           | 中           |
| VitePress          | ~2 MB     | 需水合   | ~2s      | 需插件                           | 低（偏文档） |

### 本项目的优势

- **零依赖** — 全站无 JavaScript，纯 HTML + CSS，Lighthouse 满分
- **一键日/夜切换** — 默认主题（日间紫罗兰 + 夜间赛博青），首次访问跟随系统设置，之后记忆用户选择；开发者可通过 `npm run theme:create` 拓展主题
- **自动 SEO** — 每篇文章自动注入 Open Graph、Twitter Card、JSON-LD 结构化数据
- **极简构建** — 构建完成后自动执行 RSS/Sitemap 生成，零配置
- **1 秒构建** — 相比 Hexo 的 5s+，依然足够快
- **TypeScript 类型安全** — 文章内容通过 Astro Content Collections Schema 校验

### 局限性

- **无后端功能** — 无法支持评论系统（可通过 Cusdis / Disqus / Giscus 等第三方接入）
- **无服务端搜索** — 静态站点无法服务端搜索（可用 Algolia 等外部服务）
- **需手动编辑** — 无后台管理界面（可直接在 GitHub 编辑 Markdown）

---

## 💰 支持本项目

如果你喜欢 Atom 博客，欢迎扫码打赏，给了我加个 🥤 饮料！

| 微信                                                                                                                          | 支付宝                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/zz3656/Atom/main/public/medias/reward/wechat.png" width="140" alt="微信赞赏码" /> | <img src="https://raw.githubusercontent.com/zz3656/Atom/main/public/medias/reward/alipay.png" width="140" alt="支付宝收款码" /> |

每一分支持都是对开源项目的最大鼓励 ❤️

---

## 📄 License

[MIT](LICENSE) — 自由使用、修改、分发。

---

<div align="center">

**如果这个项目对你有帮助，给个 ⭐ Star 吧！**

Made with ❤️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)

</div>
