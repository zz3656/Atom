// Atom Blog — 文章数据处理
// 统一的文章摘要提取逻辑

/**
 * 从 Markdown body 中提取摘要
 * 移除 frontmatter、引用块，返回截断后的纯文本
 */
export function extractSummary(body: string, maxLength = 120): string {
  if (!body) return '';
  let content = body.replace(/^---[\s\S]*?---/, '').trim();
  content = content.replace(/^\s*>.*$/gm, '').replace(/^\s*\n/gm, '').trim();
  const paragraphs = content.split(/\n\s*\n/);
  if (paragraphs.length > 0) {
    let para = paragraphs[0].replace(/[#*`_~\[\]()!&\x3e]/g, '').trim();
    return para.length > maxLength ? para.slice(0, maxLength) + '\u2026' : para;
  }
  return '';
}

/**
 * 分类名称标准化
 * 空分类归为 '未分类'
 */
export function normalizeCategory(category?: string): string {
  return (category && category.trim()) ? category : '未分类';
}

/**
 * 分类过滤函数生成器
 */
export function createCategoryFilter(category: string): (post: { data: { category?: string } }) => boolean {
  if (category === '未分类') {
    return (post) => (!post.data.category || !post.data.category.trim());
  }
  return (post) => post.data.category === category;
}
