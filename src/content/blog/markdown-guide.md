---
title: Markdown 写作完全指南
description: 掌握 Markdown 的常用语法——标题、列表、代码块、表格、引用、链接、图片——让你的博客写作效率翻倍。
pubDate: 2026-09-18
category: guide
tags: [Markdown, 写作, 教程, 文档]
---

Markdown 是一种轻量级标记语言，可以用纯文本写出结构化文档。本指南覆盖 Atom 博客支持的所有常用语法。

## 标题

使用 `#` 表示标题（1-6 级）：

```markdown
# 一级标题
## 二级标题
### 三级标题
```

## 段落与强调

```markdown
普通文本，**加粗**，*斜体*，~~删除线~~，`行内代码`
```

效果：普通文本，**加粗**，*斜体*，~~删除线~~，`行内代码`

## 列表

**无序列表**：

```markdown
- 项目 A
- 项目 B
  - 子项目
- 项目 C
```

**有序列表**：

```markdown
1. 第一步
2. 第二步
3. 第三步
```

## 链接

```markdown
[链接文字](https://example.com)
[带标题的链接](https://example.com "鼠标悬停文字")
```

## 图片

```markdown
![替代文本](图片URL)
```

Atom 的 Markdown 图片默认会加上 `loading="lazy"`（自动通过 remark 插件），无需手动指定。

## 代码块

三个反引号 + 语言标识启用语法高亮（基于 Shiki）：

````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

支持的语言包括 javascript、typescript、python、bash、json、html、css、yaml、markdown、rust、go 等上百种。

## 表格

```markdown
| 列 1 | 列 2 | 列 3 |
|------|------|------|
| A1   | A2   | A3   |
| B1   | B2   | B3   |
```

| 列 1 | 列 2 | 列 3 |
|------|------|------|
| A1   | A2   | A3   |
| B1   | B2   | B3   |

## 引用

```markdown
> 这是一段引用文字。
> 可以跨多行。
```

> 这是一段引用文字。
> 可以跨多行。

## 水平线

三个短横线或星号：

```markdown
---
```

---

## Frontmatter 元数据

每篇文章顶部用 YAML 格式声明元数据：

```markdown
---
title: 文章标题
description: 用于 SEO 与社交分享卡片
pubDate: 2026-09-20
updatedDate: 2026-09-21          # 可选：文章更新时间
heroImage: /medias/hero.jpg     # 可选：文章顶部大图
featuredImage: /medias/og.jpg   # 可选：OG 专用封面
category: 随笔                  # 单数分类
tags: [标签1, 标签2]            # 复数标签
reward: true                    # 可选：显示打赏码
draft: false                    # 草稿，构建时过滤
---
```

## 实战建议

1. **保持空行** —— 段落、标题、列表之间空一行，渲染更稳定
2. **代码块标注语言** —— 方便语法高亮，对屏幕阅读器也友好
3. **图片控制大小** —— Markdown 原生不支持，HTML `<img>` 标签可控
4. **描述要短** —— Frontmatter 的 `description` 用于 SEO 摘要，建议 50-150 字
5. **合理分类** —— 分类是单数（一篇文章归一类），标签是复数（一篇文章可多个）

掌握这些语法，你就能高效地写出漂亮的博客文章了！ 🎉