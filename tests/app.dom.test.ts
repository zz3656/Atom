// @vitest-environment jsdom
/**
 * Atom Blog — 客户端脚本测试（jsdom 环境）
 *
 * app.js 是 IIFE 自执行脚本，所有函数都是闭包内的私有函数。
 * 我们在 IIFE 内部通过 `globalThis.__atomBlogInternals` 暴露了纯函数，
 * 这里测试这些纯函数的正确性。
 *
 * 覆盖：
 *   - escapeHTML: XSS 防护
 *   - escapeRegex: 正则元字符转义
 *   - highlightSafe: 高亮匹配 + HTML 转义
 *   - scorePost: 搜索评分
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// 在 jsdom 下手动执行 app.js，让 IIFE 设置 globalThis.__atomBlogInternals
beforeAll(() => {
  const appJsPath = join(process.cwd(), 'src', 'scripts', 'app.js');
  const code = readFileSync(appJsPath, 'utf-8');
  // jsdom 下没有 searchBase 等 DOM 元素，IIFE 早退即可
  // 我们只需要纯函数被暴露
  // @ts-ignore
  eval(code);
});

interface Internals {
  escapeHTML: (s: unknown) => string;
  escapeRegex: (s: string) => string;
  highlightSafe: (text: string, query: string) => string;
  scorePost: (
    item: { content?: string; title?: string; categories?: string; tags?: string[] },
    query: string,
  ) => number;
}

const get = (): Internals => {
  // @ts-ignore
  const internals = (globalThis as any).__atomBlogInternals;
  if (!internals) throw new Error('app.js did not expose __atomBlogInternals');
  return internals;
};

describe('escapeHTML', () => {
  it('escapes all dangerous characters', () => {
    const { escapeHTML } = get();
    expect(escapeHTML('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
    );
  });

  it('escapes ampersands', () => {
    const { escapeHTML } = get();
    expect(escapeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes single quotes', () => {
    const { escapeHTML } = get();
    expect(escapeHTML("it's")).toBe('it&#39;s');
  });

  it('handles non-string input', () => {
    const { escapeHTML } = get();
    // escapeHTML 接受 unknown，调用 String() 转换
    expect(escapeHTML(42)).toBe('42');
    expect(escapeHTML(null)).toBe('null');
    expect(escapeHTML(undefined)).toBe('undefined');
  });

  it('returns empty string for empty input', () => {
    const { escapeHTML } = get();
    expect(escapeHTML('')).toBe('');
  });
});

describe('escapeRegex', () => {
  it('escapes regex metacharacters', () => {
    const { escapeRegex } = get();
    expect(escapeRegex('a.b*c')).toBe('a\\.b\\*c');
    expect(escapeRegex('(foo)')).toBe('\\(foo\\)');
    // 注: '-' 在字符类首/尾或被 ] 转义处是字面量，escapeRegex 不转义它
    expect(escapeRegex('[a-z]+')).toBe('\\[a-z\\]\\+');
  });

  it('leaves safe characters unchanged', () => {
    const { escapeRegex } = get();
    expect(escapeRegex('hello')).toBe('hello');
    expect(escapeRegex('123')).toBe('123');
  });
});

describe('highlightSafe', () => {
  it('wraps matches in <mark> tags', () => {
    const { highlightSafe } = get();
    expect(highlightSafe('Hello world', 'world')).toBe('Hello <mark>world</mark>');
  });

  it('is case-insensitive', () => {
    const { highlightSafe } = get();
    expect(highlightSafe('Hello WORLD', 'world')).toBe('Hello <mark>WORLD</mark>');
  });

  it('escapes HTML in input before highlighting', () => {
    const { highlightSafe } = get();
    // 实现: 先 escapeHTML 整个 text，然后用 escapeHTML(query) 作为正则匹配替换
    // <script> 中的 < > 被转义，但 query 匹配的 script 部分不带 escape 符号被 <mark> 包裹
    const result = highlightSafe('Use <script> for code', 'script');
    expect(result).not.toContain('<script>');
    // 整个 <script> 序列里没有未转义的尖括号对
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
    // query 命中处被高亮
    expect(result).toContain('<mark>script</mark>');
  });

  it('escapes regex metacharacters in query', () => {
    const { highlightSafe } = get();
    // 查询包含 . 应该当作字面量而非任意字符
    expect(highlightSafe('a.b', 'a.b')).toBe('<mark>a.b</mark>');
    // 不应该匹配 'aXb'
    expect(highlightSafe('aXb', 'a.b')).toBe('aXb');
  });

  it('returns escaped text when query is empty', () => {
    const { highlightSafe } = get();
    expect(highlightSafe('<b>hi</b>', '')).toBe('&lt;b&gt;hi&lt;/b&gt;');
  });

  it('prevents XSS via malicious query', () => {
    const { highlightSafe } = get();
    // text 里包含 <img> 标签和 query 里的字符模式，验证实现安全处理
    const result = highlightSafe('use <img> tag here', '<img>');
    expect(result).not.toContain('<img>');
    // < > 都应该被转义
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });
});

describe('scorePost', () => {
  it('returns 0 for non-matching query', () => {
    const { scorePost } = get();
    expect(
      scorePost(
        { title: 'Hello', content: 'world', tags: ['foo'], categories: 'tech' },
        'xyz',
      ),
    ).toBe(0);
  });

  it('title match scores 20', () => {
    const { scorePost } = get();
    expect(scorePost({ title: 'Astro Guide' }, 'astro')).toBe(20);
  });

  it('content match scores 10', () => {
    const { scorePost } = get();
    // scorePost 对 content 用 indexOf，调用方负责传入 lowercase query
    expect(scorePost({ content: 'Learn about astro deployment' }, 'astro')).toBe(10);
  });

  it('category match scores 5', () => {
    const { scorePost } = get();
    expect(scorePost({ categories: 'tutorial' }, 'tutorial')).toBe(5);
  });

  it('tag match scores 8 per tag', () => {
    const { scorePost } = get();
    expect(scorePost({ tags: ['astro', 'web'] }, 'astro')).toBe(8);
    expect(scorePost({ tags: ['astro', 'web'] }, 'web')).toBe(8);
  });

  it('combines all signals', () => {
    const { scorePost } = get();
    // title (toLowerCase, 20) + content (lowercase match, 10) + tag (8) + category (5) = 43
    expect(
      scorePost(
        {
          title: 'astro tips',
          content: 'this is about astro',
          tags: ['astro'],
          categories: 'astro',
        },
        'astro',
      ),
    ).toBe(43);
  });

  it('handles missing fields gracefully', () => {
    const { scorePost } = get();
    expect(scorePost({}, 'anything')).toBe(0);
    expect(scorePost({ tags: [] }, 'anything')).toBe(0);
  });

  it('is case-insensitive for title but content needs lowercase query (by design)', () => {
    const { scorePost } = get();
    // title.toLowerCase() 比较 → 大写也命中
    expect(scorePost({ title: 'ASTRO' }, 'astro')).toBe(20);
    // content 是 indexOf → 调用方必须传入 lowercase query（search() 内部会 toLowerCase）
    expect(scorePost({ content: 'astro tips' }, 'astro')).toBe(10);
  });
});