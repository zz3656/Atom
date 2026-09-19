// Atom Blog — 文章数据处理
// 统一的文章摘要提取逻辑

import { stripFrontmatter, markdownToPlainText } from './markdown-strip.js';

/**
 * 从 Markdown body 中提取摘要
 * 移除 frontmatter、引用块、Markdown 标记，返回截断后的纯文本
 */
export function extractSummary(body: string, maxLength = 120): string {
  if (!body) return '';
  const content = stripFrontmatter(body);
  // 移除首部引用块、空行
  const trimmed = content.replace(/^\s*>.*$\n?/gm, '').trim();
  const paragraphs = trimmed.split(/\n\s*\n/);
  if (paragraphs.length === 0) return '';
  // 复用纯文本提取逻辑（去除代码块、链接、HTML、Markdown 标记等）
  const para = markdownToPlainText(paragraphs[0]);
  return para.length > maxLength ? para.slice(0, maxLength) + '\u2026' : para;
}

/**
 * 分类名称标准化
 * 空分类归为 '未分类'
 */
export function normalizeCategory(category?: string): string {
  if (!category) return '未分类';
  const trimmed = category.trim();
  return trimmed || '未分类';
}

/**
 * 计算文章字数（中英文混合）
 * 中文按字计，英文按词计
 */
export function countWords(content: string): number {
  if (!content) return 0;
  // 复用共享的 Markdown → 纯文本转换
  const text = markdownToPlainText(stripFrontmatter(content));
  // 中文按字
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文按词
  const english = (text.match(/[a-zA-Z]+/g) || []).length;
  return chinese + english;
}

/**
 * 估算阅读时间（分钟）
 */
export function readingTime(content: string, wordsPerMinute = 250): number {
  const words = countWords(content);
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * 根据标签重叠度推荐相关文章
 * @param current 当前文章
 * @param allPosts 全部已发布文章
 * @param limit 返回数量
 */
export function getRelatedPosts<
  T extends { id: string; data: { title: string; tags?: string[]; category?: string } },
>(current: T, allPosts: T[], limit = 3): T[] {
  const currentTags = new Set(current.data.tags || []);
  const currentCategory = current.data.category;

  const scored = allPosts
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      // 同分类 +3
      if (p.data.category && p.data.category === currentCategory) score += 3;
      // 标签重合度 +2/每个
      const overlap = (p.data.tags || []).filter((t) => currentTags.has(t)).length;
      score += overlap * 2;
      return { post: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => x.post);
}
