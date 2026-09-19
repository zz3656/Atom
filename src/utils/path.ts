// Atom Blog — 路径工具函数
// 统一管理 base 路径处理，避免每个文件重复计算

const base = import.meta.env.BASE_URL;
const isRootBase = base === '/' || base === '';

/**
 * 当前部署是否为根路径（不带子路径前缀）
 */
export function isRoot(): boolean {
  return isRootBase;
}

/**
 * 带 base 前缀的原始路径
 */
function withBase(path: string): string {
  return isRootBase ? path : `${base}${path}`;
}

/**
 * 文章 URL（带尾斜杠，符合 Astro 默认静态路由）
 */
export function blogPostUrl(slug: string): string {
  return withBase(`/blog/${slug}/`);
}

/**
 * 文章列表/分页 URL
 */
export function blogListUrl(): string {
  return withBase('/blog/');
}

/**
 * 分类详情页 URL
 */
export function getCategoryUrl(category: string): string {
  return withBase(`/category/${category}/`);
}

/**
 * 标签详情页 URL
 */
export function getTagUrl(tag: string): string {
  return withBase(`/tag/${tag}/`);
}

/**
 * 分类列表页 URL
 */
export function categoriesUrl(): string {
  return withBase('/categories');
}

/**
 * 标签列表页 URL
 */
export function tagsUrl(): string {
  return withBase('/tags');
}

/**
 * 首页 URL
 */
export function rootPath(): string {
  return withBase('/');
}

/**
 * 关于页 URL
 */
export function aboutUrl(): string {
  return withBase('/about');
}

/**
 * RSS 订阅 URL
 */
export function rssUrl(): string {
  return withBase('/rss.xml');
}

/**
 * 任意静态资源路径（始终在 base 前缀下）
 */
export function baseAssetsPath(path: string): string {
  return withBase(path);
}
