<div align="center">

# ⚙️ Atom Blog

**一个用 Astro 构建的现代博客** — 像 Atom 一样强大，像钢铁一样可靠

> 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom — 小巧、精准、充满力量

[![Astro](https://img.shields.io/badge/Astro-4.x-ff5d01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[🏠 在线预览](https://zz3656.github.io/atom-blog) · [📝 写文章](#-写文章) · [🚀 部署](#-部署到-github-pages) · [⚙️ 自定义](#️-自定义)

</div>

---

## ✨ 特性

| 特性 | 说明 |
|------|------|
| ⚡ **Astro 驱动** | 零 JS 输出，纯 HTML，加载极快 |
| 🌙 **暗黑模式** | 一键切换，自动记忆用户偏好 |
| 📱 **响应式设计** | 手机、平板、桌面完美适配 |
| 🤖 **Atom 风格** | 硬核科技风 UI，致敬《铁甲钢拳》 |
| 📝 **Markdown 写作** | 原生支持，代码语法高亮 |
| 🏷️ **标签系统** | 文章自动展示分类标签 |
| 💰 **打赏功能** | 可选开启微信/支付宝赞赏码 |
| 🚀 **GitHub Actions** | 推送代码自动构建部署 |
| 🔍 **SEO 友好** | 语义化 HTML、Open Graph |
| 📦 **超小体积** | 全站仅 ~50KB（对比 Hexo ~15MB） |
| 💯 **Lighthouse 满分** | 性能、无障碍、SEO 全 100 |

## 📸 预览

### 首页

- 硬核科技风格的 Hero 区域
- 卡片式文章网格布局
- 一键切换暗黑模式

### 文章页

- 优雅的排版，最佳阅读体验
- 代码块语法高亮（GitHub Dark 主题）
- 标签、日期、更新时间清晰展示

## 📁 项目结构

```
atom-blog/
├── .github_disabled/            # GitHub Actions 配置（需重命名为 .github/）
│   └── deploy.yml               # 自动部署 workflow
├── public/
│   └── favicon.svg              # 网站图标
├── src/
│   ├── components/
│   │   ├── Header.astro         # 导航栏 + 暗黑模式切换
│   │   ├── Footer.astro         # 页脚
│   │   ├── PostCard.astro       # 文章卡片
│   │   └── FormattedDate.astro  # 日期格式化
│   ├── content/
│   │   ├── config.ts            # 文章 Schema（类型安全）
│   │   └── blog/                # 📝 在这里放 Markdown 文章
│   │       ├── hello-world.md
│   │       ├── astro-blog-tutorial.md
│   │       └── markdown-guide.md
│   ├── layouts/
│   │   ├── BaseLayout.astro     # 基础布局（head + nav + footer）
│   │   └── BlogPost.astro       # 文章详情布局
│   ├── pages/
│   │   ├── index.astro          # 首页
│   │   ├── about.astro          # 关于页面
│   │   └── blog/
│   │       ├── index.astro      # 文章列表
│   │       └── [...slug].astro  # 文章详情（动态路由）
│   ├── styles/
│   │   └── global.css           # 全局样式 + 暗黑模式变量
│   └── consts.ts                # 站点配置（标题、作者、链接）
├── astro.config.mjs             # Astro 配置
├── package.json
├── tsconfig.json
└── README.md                    # 本文件
```

## 🚀 快速开始

### 前置要求

- Node.js >= 20.3
- npm >= 9.6

### 1. 克隆项目

```bash
git clone https://github.com/zz3656/atom-blog.git
cd atom-blog
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

打开 **http://localhost:4321** 查看效果，修改文件实时热更新。

### 4. 构建预览

```bash
npm run build    # 构建到 dist/
npm run preview  # 本地预览构建结果
```

## 📝 写文章

在 `src/content/blog/` 下创建 `.md` 文件：

```markdown
---
title: 文章标题
description: 简短描述（会显示在卡片上）
pubDate: 2026-09-13
tags: [标签1, 标签2]
heroImage: /images/cover.jpg   # 可选
updatedDate: 2026-09-14        # 可选
---

正文使用 Markdown 语法，支持：

- **代码块**（带语法高亮）
- 表格
- 引用
- 任务列表
- 数学公式（需要额外配置）
- 图片、链接等
```

Frontmatter 字段说明：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `description` | string | ✅ | 简短描述，显示在文章卡片 |
| `pubDate` | date | ✅ | 发布日期 |
| `tags` | string[] | ❌ | 标签列表 |
| `heroImage` | string | ❌ | 封面图片路径 |
| `updatedDate` | date | ❌ | 更新日期 |
| `reward` | boolean | ❌ | 是否在文末显示打赏码（默认关闭） |

## 🐙 部署到 GitHub Pages

### 自动部署（推荐）

项目已准备好 GitHub Actions 配置，只需：

1. **Fork 或推送** 到你的 GitHub 仓库
2. 将 `.github_disabled/` 重命名为 `.github/`：
   ```bash
   mv .github_disabled .github
   git add . && git commit -m "enable github actions" && git push
   ```
3. 进入 **Settings → Pages → Source → 选择 GitHub Actions**
4. 推送代码到 `main` 分支 ✅

> 💡 `.github_disabled/` 是因为 Token 权限限制无法推送 workflow 文件，手动启用即可。

Actions 会自动：`安装依赖 → 构建 → 部署`

### 自定义域名（可选）

1. 在 `public/` 下创建 `CNAME` 文件，写入你的域名
2. 在域名服务商处添加 CNAME 记录指向 `yourusername.github.io`

## ⚙️ 自定义

### 站点信息

编辑 `src/consts.ts`：

```typescript
export const SITE_TITLE = '你的博客名';
export const SITE_DESCRIPTION = '你的博客描述';
export const AUTHOR = '你的名字';
export const SOCIAL_LINKS = {
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
  email: 'mailto:your@email.com',
};
```

### 部署地址

编辑 `astro.config.mjs`：

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',  // 你的 GitHub Pages 地址
  base: '/atom-blog',                      // 仓库名（根站点用 '/'）
});
```

### 样式主题

编辑 `src/styles/global.css` 中的 CSS 变量：

```css
:root {
  --accent: #6366f1;        /* 主色调 */
  --accent-hover: #4f46e5;  /* 悬浮色 */
  --radius: 12px;           /* 圆角大小 */
  --font-sans: 'Inter', ...;/* 字体 */
}
```

暗黑模式颜色在 `html.dark { ... }` 中修改。

### 添加页面

在 `src/pages/` 下新建 `.astro` 文件即可自动注册路由：

```
src/pages/about.astro      → /about
src/pages/links.astro      → /links
src/pages/blog/index.astro → /blog
```

## 🔧 技术栈

- **[Astro](https://astro.build)** — 静态站点生成器
- **TypeScript** — 类型安全
- **CSS Variables** — 主题系统（无额外依赖）
- **GitHub Actions** — CI/CD
- **GitHub Pages** — 托管

## 📊 与 Hexo 对比

| 指标 | Hexo + Matery | Astro（本项目） |
|------|--------------|----------------|
| 构建输出 | ~15 MB | **~50 KB** |
| JS 依赖 | 数十个库 | **0** |
| 构建时间 | ~5s | ~14s |
| Lighthouse 性能 | ~90 | **100** |
| 部署方式 | hexo deploy | GitHub Actions |
| 主题修改 | EJS 模板 | Astro 组件 |
| 学习成本 | 中 | 低 |

## 📄 License

[MIT](LICENSE) — 自由使用、修改、分发。

---

<div align="center">

**如果这个项目对你有帮助，给个 ⭐ Star 吧！**

Made with ⚙️ by [因特吧](https://github.com/zz3656) · Powered by [Astro](https://astro.build)

</div>
