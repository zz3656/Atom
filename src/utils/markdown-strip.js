/**
 * Atom Blog — 共享的 Markdown 纯文本提取工具
 *
 * 这个文件是纯 JavaScript（无 TypeScript 类型），因此可以被：
 *   - Astro 组件（通过 src/utils/blog.ts 的 TS wrapper 调用）
 *   - Node.js 脚本（generate-rss.mjs、convert-hexo.mjs）直接 import
 *
 * 之所以不放成 .ts：脚本运行在 Node 22 下，没装 tsx 也不开 strip-types，
 * 引入 .ts 会 require 构建步骤。.js/.mjs 双端通用最稳。
 */

/**
 * 把 Markdown 内容转为纯文本（去除代码块、行内代码、链接、HTML、标记符号）
 * 用于搜索索引、RSS 全文、摘要提取等。
 *
 * @param {string} md Markdown 原文
 * @returns {string} 纯文本
 */
export function markdownToPlainText(md) {
  if (!md) return '';
  return (
    md
      // 代码块
      .replace(/```[\s\S]*?```/g, '')
      // 行内代码
      .replace(/`[^`]+`/g, '')
      // 链接 [text](url) / 图片 ![alt](url) → 保留 alt 文本
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      // HTML 标签
      .replace(/<[^>]+>/g, '')
      // 引用标记
      .replace(/^>+\s?/gm, '')
      // 常见 Markdown 行内标记
      .replace(/[#*_~>|]/g, '')
      // 折叠空白
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * 从 Markdown body 中移除 frontmatter（最顶部 `---` 包裹的 YAML）
 * 用于摘要提取、搜索索引等所有需要"正文"的场景。
 *
 * @param {string} body 含或不含 frontmatter 的 Markdown
 * @returns {string} 去掉 frontmatter 后的内容（已 trim）
 */
export function stripFrontmatter(body) {
  if (!body) return '';
  const m = body.match(/^---[\s\S]*?---\s*/);
  return m ? body.slice(m[0].length).trim() : body.trim();
}
