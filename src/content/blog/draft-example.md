---
title: '草稿示例：可选 frontmatter 字段'
description: '一篇不会进入构建的草稿，用来演示 featuredImage / updatedDate / reward / draft 的写法。'
pubDate: 2026-11-16
updatedDate: 2026-11-16
category: 'guide'
tags: ['Atom', 'frontmatter']
featuredImage: '/og-default.png'
reward: true
draft: true
---

这是一篇 **draft: true** 的示例文章：`npm run build` 会过滤掉它（页面、RSS、搜索索引、sitemap 都不会出现），
所以可以放心留着当模板。

可选项一览：

- `featuredImage` —— 社交分享卡片的专用封面（优先于 `heroImage`；缺省时用站点的 `og-default.png`）
- `updatedDate` —— 更新日期，sitemap 的 `lastmod` 与文末「更新于」都用它
- `reward` —— 是否在文末显示打赏码
- `draft` —— 草稿开关；`npm run new "标题" --draft` 会自动写这一行

把 `draft: true` 去掉，这篇文章就会出现在站点里。
