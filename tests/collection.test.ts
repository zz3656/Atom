import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock astro:content getCollection BEFORE importing the module under test
const mockGetCollection = vi.fn();
vi.mock('astro:content', () => ({
  getCollection: (...args: unknown[]) => mockGetCollection(...args),
}));

import { getPublishedPosts } from '../src/utils/collection';

beforeEach(() => {
  mockGetCollection.mockReset();
});

describe('getPublishedPosts', () => {
  it('returns posts filtered by !data.draft and sorted by pubDate desc', async () => {
    // 模拟 Astro getCollection + filter: Astro 接受 filter fn，调用时只返回匹配的项。
    // 这里 mock 直接模拟 Astro 调用 filter 后的输出 (即不含 draft=true 的)。
    mockGetCollection.mockImplementation(async (_collection, filter) => {
      const all = [
        { data: { pubDate: new Date('2026-01-01'), draft: false } },
        { data: { pubDate: new Date('2026-05-01'), draft: false } },
        { data: { pubDate: new Date('2026-03-01'), draft: true } },
      ];
      return all.filter(filter);
    });
    const posts = await getPublishedPosts();
    expect(posts).toHaveLength(2);
    expect(posts[0].data.pubDate.toISOString()).toBe('2026-05-01T00:00:00.000Z');
    expect(posts[1].data.pubDate.toISOString()).toBe('2026-01-01T00:00:00.000Z');
  });

  it('returns empty array when no posts', async () => {
    mockGetCollection.mockResolvedValue([]);
    const posts = await getPublishedPosts();
    expect(posts).toEqual([]);
  });

  it('passes filter fn to getCollection to filter drafts at source', async () => {
    mockGetCollection.mockResolvedValue([]);
    await getPublishedPosts();
    expect(mockGetCollection).toHaveBeenCalledWith('blog', expect.any(Function));
    // 验证 filter 实际过滤 draft
    const filter = mockGetCollection.mock.calls[0][1];
    expect(filter({ data: { draft: false } })).toBe(true);
    expect(filter({ data: { draft: true } })).toBe(false);
  });
});
