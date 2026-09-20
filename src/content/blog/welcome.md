---
title: 定制你的 Atom 博客 — 上线后第一步该改什么
description: 拿到 Atom 模板后的最小可行动清单：站点信息、文章内容、Logo/Favicon、社交链接，以及每项该改哪些文件。
pubDate: 2026-09-18
category: guide
tags: [Atom, 入门, 客制化]
---

恭喜，Atom 博客已经在你的仓库里跑起来了！但**默认内容是你的第一步作业**——把它替换成你自己的东西之前，发布上线会显得很样板。本指南把"该改哪些文件"列成清单，按优先级排好。

> 💡 完成大约 10 分钟的修改就能让博客看起来是你的，而不是"Astro Demo"。

## 一、站点基本信息（必改）

**文件**：`src/consts.ts`

打开后只看一个文件，全站导航、Footer、SEO meta、RSS 名称都会跟着变：

```typescript
export const SITE_TITLE = '你的博客名';        // 浏览器标签、SEO 标题、OG 标签、RSS 名称
export const SITE_NAME = 'MyBlog';             // 导航栏显示的短名称
export const SITE_DESCRIPTION = '你的博客描述'; // meta description、OG、Twitter Card
export const AUTHOR = '你的名字';               // meta author 标签

export const SITE_LOGO = '/logos/logo.svg';     // 导航栏 Logo 路径
export const SITE_FAVICON = '/favicon.svg';     // 浏览器标签图标

export const REPO_URL = 'https://github.com/你的用户名/你的仓库';
// ↑ Footer 的 "Atom" 链接指向这里（项目源代码仓库）

export const SOCIAL_LINKS = {
  github: 'https://github.com/你的用户名',
  twitter: '',                                  // 不填就不显示
  email: '',                                    // 不填就不显示
};

export const POSTS_PER_PAGE = 10;               // 首页 / 文章列表每页显示几篇
```

**字段说明**：

| 字段 | 出现在哪里 |
|---|---|
| `SITE_TITLE` | 浏览器标题、SEO、OG、Twitter Card、RSS |
| `SITE_NAME` | 导航栏 Logo 旁的短名 |
| `SITE_DESCRIPTION` | meta description、社交分享卡片 |
| `SITE_LOGO` / `SITE_FAVICON` | 导航栏 / 浏览器标签页 |
| `SOCIAL_LINKS.github` | Footer 的 🐙 GitHub（可改成项目仓库或个人主页）|
| `REPO_URL` | Footer 的 "Atom" 链接，指向你的源代码仓库 |

## 二、替换示例文章（必改）

**位置**：`src/content/blog/`

仓库默认附带 3 篇示例文章。建议至少删掉或替换成你自己的内容：

```bash
# 删除示例文章
rm src/content/blog/welcome.md
rm src/content/blog/astro-blog-tutorial.md

# 保留 markdown-guide.md（学习 Markdown 语法用，删了也能从 GitHub 找到）

# 或者用 CLI 交互式创建
npm run new
```

**创建第一篇文章的最小 Frontmatter**：

```markdown
---
title: 我的第一篇文章
description: 简短描述（建议 50-150 字，用于 SEO 摘要和卡片预览）
pubDate: 2026-09-20
category: 随笔
tags: [标签1, 标签2]
draft: false                # true 表示草稿，构建时被过滤掉
---

正文内容...
```

完整字段说明见 [Markdown 写作完全指南](/blog/markdown-guide/)。

## 三、Logo 和 Favicon（推荐改）

替换两个图片文件即可，**不需要改任何组件代码**：

| 文件 | 用途 | 推荐尺寸 |
|---|---|---|
| `public/logos/logo.svg` | 导航栏左侧图标 | 32×32 矢量 |
| `public/favicon.svg` | 浏览器标签页图标 | 任意，矢量自适应 |

也可以是 PNG/WebP（`SITE_LOGO` 后缀改一下就行）。最简单的办法：直接覆盖源文件，保持路径不变。

## 四、关于页面（推荐改）

**文件**：`src/pages/about.astro`

默认是个简单的占位页。改成你的自我介绍 + 站点说明，访客会更信任你的内容。

## 五、部署到生产（最后一步）

代码改完后，提交并推送，CI 自动部署到 GitHub Pages：

```bash
git add -A
git commit -m "feat: 定制站点信息"
git push origin main
```

GitHub Actions 会自动跑 `npm run build` 并部署。几分钟后访问你的 `https://<用户名>.github.io/<仓库名>/` 就能看到效果。

**首次部署配置**：进入 GitHub 仓库的 Settings → Pages → Source 选 **GitHub Actions**，并把 Workflow permissions 设为 **Read and write permissions**。

## 完整清单速查

| 优先级 | 改什么 | 文件 |
|---|---|---|
| ⭐ 必改 | 站点信息 | `src/consts.ts` |
| ⭐ 必改 | 示例文章 | `src/content/blog/*.md` |
| ⭐ 推荐 | Logo + Favicon | `public/logos/logo.svg`, `public/favicon.svg` |
| 推荐 | 关于页面 | `src/pages/about.astro` |
| 可选 | 主题 | `src/themes/` + 主题脚手架 `npm run theme:create <id>` |
| 可选 | 社交链接 | `SOCIAL_LINKS` 在 `src/consts.ts` |

## 下一步

- 📚 [Markdown 写作完全指南](/blog/markdown-guide/)——所有可用语法
- 🏗️ [Atom 博客的技术架构解析](/blog/astro-blog-tutorial/)——想了解为什么这样设计
- 📖 [README](https://github.com/zz3656/Atom)——部署、CLI、主题开发文档
