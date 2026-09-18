// Atom Blog — 路径工具函数
// 统一管理 base 路径处理，避免每个文件重复计算

const base = import.meta.env.BASE_URL;
const isRootBase = base === '/' || base === '';

export function isRoot(): boolean {
  return isRootBase;
}

export function blogSlug(slug: string): string {
  return isRootBase ? `/blog/${slug}/` : `${base}/blog/${slug}/`;
}

export function pageUrl(p: number): string {
  if (p <= 1) return isRootBase ? '/' : base;
  return isRootBase ? `/${p}/` : `${base}/${p}/`;
}

export function blogPath(slug: string): string {
  return isRootBase ? `/blog/${slug}` : `${base}/blog/${slug}`;
}

export function rootPath(): string {
  return isRootBase ? '/' : base;
}

export function getCategoryUrl(category: string): string {
  return isRootBase ? `/category/${category}/` : `${base}/category/${category}/`;
}

export function getTagUrl(tag: string): string {
  return isRootBase ? `/tag/${tag}/` : `${base}/tag/${tag}/`;
}

export function rssUrl(): string {
  return isRootBase ? '/rss.xml' : `${base}/rss.xml`;
}

export function aboutUrl(): string {
  return isRootBase ? '/about' : `${base}about`;
}

export function baseAssetsPath(path: string): string {
  return isRootBase ? path : base + path;
}
