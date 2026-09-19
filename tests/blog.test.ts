import { describe, it, expect } from 'vitest';
import {
  extractSummary,
  normalizeCategory,
  countWords,
  readingTime,
  getRelatedPosts,
} from '../src/utils/blog';

describe('extractSummary', () => {
  it('returns empty string for empty body', () => {
    expect(extractSummary('')).toBe('');
  });

  it('removes frontmatter and returns first paragraph', () => {
    const body = `---
title: Test
---

This is the first paragraph.`;
    expect(extractSummary(body)).toBe('This is the first paragraph.');
  });

  it('truncates long paragraphs with ellipsis', () => {
    const body = 'A'.repeat(200);
    const summary = extractSummary(body, 50);
    expect(summary.length).toBeLessThanOrEqual(51); // 50 chars + ellipsis
    expect(summary).toMatch(/\u2026$/);
  });

  it('strips basic markdown markers', () => {
    const body = '**Bold** and *italic* text';
    expect(extractSummary(body)).toBe('Bold and italic text');
  });
});

describe('normalizeCategory', () => {
  it('returns "未分类" for empty/undefined', () => {
    expect(normalizeCategory(undefined)).toBe('未分类');
    expect(normalizeCategory('')).toBe('未分类');
    expect(normalizeCategory('   ')).toBe('未分类');
  });

  it('returns the trimmed category for non-empty', () => {
    expect(normalizeCategory('Tech')).toBe('Tech');
    expect(normalizeCategory('  Tech  ')).toBe('Tech');
  });
});

describe('countWords', () => {
  it('counts Chinese characters individually', () => {
    expect(countWords('你好世界')).toBe(4);
  });

  it('counts English words individually', () => {
    expect(countWords('hello world foo')).toBe(3);
  });

  it('returns 0 for empty', () => {
    expect(countWords('')).toBe(0);
  });

  it('handles mixed content', () => {
    expect(countWords('Hello 世界')).toBe(3); // 1 English word + 2 Chinese chars
  });
});

describe('readingTime', () => {
  it('returns at least 1 minute for non-empty content', () => {
    expect(readingTime('test')).toBe(1);
  });

  it('returns 0 → 1 for very short content', () => {
    expect(readingTime('')).toBe(1);
  });

  it('scales with length', () => {
    const longText = 'word '.repeat(500); // 500 English words
    expect(readingTime(longText)).toBe(2); // 500/250 = 2 minutes
  });
});

describe('getRelatedPosts', () => {
  const posts = [
    { id: 'a', data: { title: 'A', tags: ['x', 'y'], category: 'Tech' } },
    { id: 'b', data: { title: 'B', tags: ['x'], category: 'Tech' } },
    { id: 'c', data: { title: 'C', tags: ['z'], category: 'Life' } },
    { id: 'd', data: { title: 'D', tags: [], category: 'Tech' } },
  ];

  it('returns posts with tag/category matches', () => {
    const related = getRelatedPosts(posts[0], posts, 3);
    // b: shared tag 'x' (2) + same category Tech (3) = 5
    // c: different category Life, no shared tags = 0 → excluded
    // d: same category Tech (3), no shared tags = 3
    expect(related.map((p) => p.id)).toEqual(['b', 'd']);
  });

  it('excludes the current post', () => {
    const related = getRelatedPosts(posts[0], posts, 10);
    expect(related.find((p) => p.id === 'a')).toBeUndefined();
  });

  it('returns empty when no matches', () => {
    const lonely = { id: 'lone', data: { title: 'L', tags: ['unique'], category: 'Unique' } };
    expect(getRelatedPosts(lonely, posts, 3)).toEqual([]);
  });

  it('respects limit', () => {
    const related = getRelatedPosts(posts[0], posts, 1);
    expect(related).toHaveLength(1);
  });
});
