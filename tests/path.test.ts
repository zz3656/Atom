import { describe, it, expect } from 'vitest';
import {
  blogPostUrl,
  blogListUrl,
  getCategoryUrl,
  getTagUrl,
  categoriesUrl,
  tagsUrl,
  rootPath,
  aboutUrl,
  rssUrl,
  baseAssetsPath,
} from '../src/utils/path';

/**
 * Vitest 在 Node 下运行时 import.meta.env.BASE_URL 默认为 '/'，
 * 因此 path.ts 内部会走"根路径"分支。下面覆盖所有 helper 函数，
 * 确保根路径下行为正确。
 *
 * 对带子路径前缀（如 GitHub Pages /my-repo/）的场景，
 * 在 Astro 运行时由 import.meta.env.BASE_URL 提供，
 * 通过 `astro build --base '/my-repo'` 验证。
 */
describe('path helpers (root base)', () => {
  it('blogPostUrl adds trailing slash', () => {
    expect(blogPostUrl('hello-world')).toBe('/blog/hello-world/');
  });

  it('blogListUrl returns /blog/', () => {
    expect(blogListUrl()).toBe('/blog/');
  });

  it('getCategoryUrl encodes category name', () => {
    expect(getCategoryUrl('Tech')).toBe('/category/Tech/');
  });

  it('getTagUrl encodes tag name', () => {
    expect(getTagUrl('Astro')).toBe('/tag/Astro/');
  });

  it('categoriesUrl returns /categories', () => {
    expect(categoriesUrl()).toBe('/categories');
  });

  it('tagsUrl returns /tags', () => {
    expect(tagsUrl()).toBe('/tags');
  });

  it('rootPath returns /', () => {
    expect(rootPath()).toBe('/');
  });

  it('aboutUrl returns /about', () => {
    expect(aboutUrl()).toBe('/about');
  });

  it('rssUrl returns /rss.xml', () => {
    expect(rssUrl()).toBe('/rss.xml');
  });

  it('baseAssetsPath forwards arbitrary path', () => {
    expect(baseAssetsPath('/favicon.svg')).toBe('/favicon.svg');
    expect(baseAssetsPath('/js/app.js')).toBe('/js/app.js');
  });
});
