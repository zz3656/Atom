/**
 * Atom Blog — 共享的 Markdown 纯文本提取工具
 *
 * 重写为 TypeScript（带类型注解）后被两类使用者引用：
 *   - Astro 组件 / TS 工具（src/utils/blog.ts）
 *   - Node.js 脚本（scripts/generate-rss.mjs）—— 通过
 *     `node --experimental-strip-types` 调用，Node 22+ 原生支持
 *
 * 不再用 .js 是为了与项目其他 utils 文件保持类型一致。
 */

/**
 * 把 Markdown 内容转为纯文本（去除代码块、行内代码、链接、HTML、标记符号）
 * 用于搜索索引、RSS 全文、摘要提取等。
 */
export function markdownToPlainText(md: string): string {
  if (!md) return '';
  return md
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
    .trim();
}

/**
 * 从 Markdown body 中移除 frontmatter（最顶部 `---` 包裹的 YAML）
 * 用于摘要提取、搜索索引等所有需要"正文"的场景。
 */
export function stripFrontmatter(body: string): string {
  if (!body) return '';
  const m = body.match(/^---[\s\S]*?---\s*/);
  return m ? body.slice(m[0].length).trim() : body.trim();
}
