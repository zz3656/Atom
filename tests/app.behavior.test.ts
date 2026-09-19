// @vitest-environment jsdom
/**
 * Atom Blog — 客户端脚本行为测试（DOM 交互层）
 *
 * app.js 的 IIFE 会根据 DOM 探测自动启用各模块。
 * 这里用 jsdom 模拟真实页面结构，加载 app.js，触发交互，断言 DOM 变化。
 *
 * 覆盖：
 *   - Theme toggle: 点击切换 .dark class
 *   - Mobile nav: 点击 .nav-toggle 切换 .open class
 *   - Back to top: 滚动时切换 .visible class
 *   - Code copy: 注入复制按钮 + 复制逻辑（mock navigator.clipboard）
 *   - Image zoom: 点击图片打开 overlay
 *   - Reading progress: 滚动时更新 width
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const APP_JS = readFileSync(join(process.cwd(), 'src', 'scripts', 'app.js'), 'utf-8');

// jsdom 不实现的 API polyfill
beforeEach(() => {
  // matchMedia: app.js 在 prefersReducedMotion 检查和 theme toggle 里都会调用
  // @ts-ignore
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  // scrollTo: 用于观察 app.js 是否调用了 window.scrollTo
  // @ts-ignore
  window.scrollTo = vi.fn();
});

/**
 * 用 jsdom 装载一个最小可用的 DOM 骨架，然后执行 app.js。
 * 每次 beforeEach 都重新 setup，互不干扰。
 */
function setupPage(html: string, opts: { theme?: string; mode?: string } = {}) {
  // jsdom 中 document.documentElement.innerHTML 重写不可靠
  // 正确做法: 清 body + 手动设 html 属性 + 抽 <body>...</body> 内容到 body.innerHTML
  document.body.innerHTML = '';
  document.documentElement.setAttribute('data-theme', opts.theme || 'atom-default');
  document.documentElement.setAttribute('data-mode', opts.mode || 'light');
  var bodyContent = html
    .replace(/^[\s\S]*?<body[^>]*>/, '')
    .replace(/<\/body>[\s\S]*$/, '')
    .trim();
  document.body.innerHTML = bodyContent;
  // 重置 globalThis 状态
  // @ts-ignore
  delete (globalThis as any).__atomBlogInternals;
  // 模拟 BaseLayout 设置的 data-search-base
  document.body.setAttribute('data-search-base', '/');
  // 在 controlled env 下 eval app.js
  // @ts-ignore
  eval(APP_JS);
}

afterEach(() => {
  vi.restoreAllMocks();
  // 清空 body 防止跨测试污染
  document.body.innerHTML = '';
  document.documentElement.setAttribute('data-theme', 'atom-default');
  document.documentElement.setAttribute('data-mode', 'light');
});

// ============================================================
// Theme picker (multi-theme system)
// ============================================================
describe('theme picker', () => {
  beforeEach(() => {
    setupPage(
      `
      <body>
        <div class="theme-picker" id="theme-picker">
          <button id="theme-toggle" aria-expanded="false">
            <span id="theme-toggle-icon">🌙</span>
          </button>
          <div id="theme-menu" role="menu" hidden>
            <button class="theme-option" data-theme-id="atom-default">Atom Default</button>
            <button class="theme-option" data-theme-id="solarized">Solarized</button>
            <button class="theme-option" data-theme-id="sepia">Sepia</button>
            <button class="theme-option" data-mode="light">Light</button>
            <button class="theme-option" data-mode="dark">Dark</button>
          </div>
        </div>
      </body>
    `,
      { theme: 'atom-default', mode: 'light' },
    );
  });

  it('opens menu on toggle click', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    const menu = document.getElementById('theme-menu') as HTMLElement;
    expect(menu.hidden).toBe(true);
    btn.click();
    expect(menu.hidden).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    btn.click();
    expect(menu.hidden).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('changes data-theme attribute on theme option click', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    btn.click();
    const solarizedOpt = document.querySelector('[data-theme-id="solarized"]') as HTMLButtonElement;
    solarizedOpt.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('solarized');
    expect(localStorage.getItem('themeId')).toBe('solarized');
    // menu closes after selection
    expect((document.getElementById('theme-menu') as HTMLElement).hidden).toBe(true);
  });

  it('changes data-mode attribute on mode option click', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    btn.click();
    const darkOpt = document.querySelector('[data-mode="dark"]') as HTMLButtonElement;
    darkOpt.click();
    expect(document.documentElement.getAttribute('data-mode')).toBe('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });

  it('updates toggle icon when mode changes', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    btn.click();
    const darkOpt = document.querySelector('[data-mode="dark"]') as HTMLButtonElement;
    darkOpt.click();
    const icon = document.getElementById('theme-toggle-icon');
    expect(icon?.textContent).toBe('\u2600\uFE0F'); // sun in dark mode
    btn.click();
    const lightOpt = document.querySelector('[data-mode="light"]') as HTMLButtonElement;
    lightOpt.click();
    expect(icon?.textContent).toBe('\uD83C\uDF19'); // moon in light mode
  });

  it('closes menu on outside click', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    btn.click();
    const menu = document.getElementById('theme-menu') as HTMLElement;
    expect(menu.hidden).toBe(false);
    // click outside
    document.body.click();
    expect(menu.hidden).toBe(true);
  });

  it('closes menu on ESC key', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    btn.click();
    const menu = document.getElementById('theme-menu') as HTMLElement;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(menu.hidden).toBe(true);
  });

  it('marks active theme option', () => {
    const btn = document.getElementById('theme-toggle') as HTMLButtonElement;
    btn.click();
    const defaultOpt = document.querySelector('[data-theme-id="atom-default"]') as HTMLButtonElement;
    expect(defaultOpt.classList.contains('active')).toBe(true);
    const solarizedOpt = document.querySelector('[data-theme-id="solarized"]') as HTMLButtonElement;
    expect(solarizedOpt.classList.contains('active')).toBe(false);
  });
});

// ============================================================
// Mobile nav toggle
// ============================================================
describe('mobile nav toggle', () => {
  beforeEach(() => {
    setupPage(`
      <html>
        <body>
          <button id="nav-toggle" aria-expanded="false">☰</button>
          <div id="nav-links">
            <a class="nav-link" href="/">Home</a>
            <a class="nav-link" href="/blog">Blog</a>
          </div>
        </body>
      </html>
    `);
  });

  it('toggles .open on click', () => {
    const toggle = document.getElementById('nav-toggle') as HTMLButtonElement;
    const links = document.getElementById('nav-links') as HTMLElement;
    expect(links.classList.contains('open')).toBe(false);
    toggle.click();
    expect(links.classList.contains('open')).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    expect(links.classList.contains('open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when nav link is clicked', () => {
    const toggle = document.getElementById('nav-toggle') as HTMLButtonElement;
    const link = document.querySelector('.nav-link') as HTMLAnchorElement;
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    link.click();
    expect(document.getElementById('nav-links')?.classList.contains('open')).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});

// ============================================================
// Back to top
// ============================================================
describe('back to top', () => {
  beforeEach(() => {
    setupPage(`
      <html>
        <body>
          <button id="back-to-top" class="back-to-top" type="button">↑</button>
        </body>
      </html>
    `);
  });

  it('hides button initially (scrollY < 600)', () => {
    const btn = document.getElementById('back-to-top') as HTMLButtonElement;
    // jsdom 默认 scrollY = 0
    expect(btn.classList.contains('visible')).toBe(false);
  });

  it('shows button when scrolled past threshold', () => {
    const btn = document.getElementById('back-to-top') as HTMLButtonElement;
    // 模拟滚动
    Object.defineProperty(window, 'scrollY', { value: 700, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(btn.classList.contains('visible')).toBe(true);
  });

  it('hides again when scrolled back up', () => {
    const btn = document.getElementById('back-to-top') as HTMLButtonElement;
    Object.defineProperty(window, 'scrollY', { value: 700, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(btn.classList.contains('visible')).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(btn.classList.contains('visible')).toBe(false);
  });

  it('scrolls to top on click', () => {
    const btn = document.getElementById('back-to-top') as HTMLButtonElement;
    btn.click();
    // global beforeEach 已 mock window.scrollTo
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: expect.any(String) });
  });
});

// ============================================================
// Code copy buttons
// ============================================================
describe('code copy buttons', () => {
  beforeEach(() => {
    setupPage(`
      <html>
        <body>
          <article class="post-content">
            <pre><code>const x = 42;</code></pre>
            <pre><code>console.log(x);</code></pre>
          </article>
        </body>
      </html>
    `);
  });

  it('injects a copy button into each <pre>', () => {
    const wrappers = document.querySelectorAll('.code-wrapper');
    expect(wrappers.length).toBe(2);
    const btns = document.querySelectorAll('.code-copy-btn');
    expect(btns.length).toBe(2);
    expect(btns[0]?.getAttribute('aria-label')).toBe('复制代码');
  });

  it('copies text to clipboard on click', async () => {
    const writeSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeSpy },
      configurable: true,
    });
    const btn = document.querySelector('.code-copy-btn') as HTMLButtonElement;
    btn.click();
    // 等待 microtask
    await new Promise((r) => setTimeout(r, 0));
    expect(writeSpy).toHaveBeenCalledWith('const x = 42;');
  });

  it('shows 已复制 feedback after successful copy', async () => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const btn = document.querySelector('.code-copy-btn') as HTMLButtonElement;
    btn.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(btn.classList.contains('copied')).toBe(true);
    expect(btn.textContent).toContain('已复制');
  });

  it('falls back to textarea execCommand when clipboard API missing', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    // jsdom 没有 document.execCommand，手动 stub 它
    // @ts-ignore
    document.execCommand = vi.fn().mockReturnValue(true);
    const btn = document.querySelector('.code-copy-btn') as HTMLButtonElement;
    btn.click();
    await new Promise((r) => setTimeout(r, 0));
    // @ts-ignore
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});

// ============================================================
// Image zoom
// ============================================================
describe('image zoom', () => {
  beforeEach(() => {
    setupPage(`
      <html>
        <body>
          <article class="post-content">
            <img src="/images/a.jpg" alt="image a" />
            <img src="/images/b.jpg" alt="image b" />
          </article>
        </body>
      </html>
    `);
  });

  it('appends an overlay element to body', () => {
    const overlay = document.querySelector('.image-zoom-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute('role')).toBe('dialog');
  });

  it('sets cursor: zoom-in on article images', () => {
    const img = document.querySelector('.post-content img') as HTMLImageElement;
    expect(img.style.cursor).toBe('zoom-in');
  });

  it('opens overlay when image is clicked', () => {
    const overlay = document.querySelector('.image-zoom-overlay') as HTMLElement;
    const img = document.querySelector('.post-content img') as HTMLImageElement;
    expect(overlay.style.display).toBe('none');
    img.click();
    expect(overlay.style.display).toBe('flex');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes overlay on ESC key', () => {
    const overlay = document.querySelector('.image-zoom-overlay') as HTMLElement;
    const img = document.querySelector('.post-content img') as HTMLImageElement;
    img.click();
    expect(overlay.style.display).toBe('flex');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(overlay.style.display).toBe('none');
    expect(document.body.style.overflow).toBe('');
  });
});

// ============================================================
// Reading progress
// ============================================================
describe('reading progress', () => {
  beforeEach(() => {
    setupPage(`
      <html>
        <body>
          <article class="post-content">Lorem ipsum dolor sit amet.</article>
          <div class="reading-progress-fill" style="width: 0%"></div>
        </body>
      </html>
    `);
  });

  it('updates bar width on scroll', () => {
    const bar = document.querySelector('.reading-progress-fill') as HTMLElement;
    // 初始宽度由 updateProgress() 调用决定
    expect(bar.style.width).toMatch(/%$/);
    // 触发滚动
    window.dispatchEvent(new Event('scroll'));
    // width 仍应为合法百分比
    expect(bar.style.width).toMatch(/^\d+(\.\d+)?%$/);
  });
});

// ============================================================
// Module isolation
// ============================================================
describe('module isolation', () => {
  it('runs without errors on minimal page (no nav, no search)', () => {
    setupPage('<html><body><div></div></body></html>');
    // 没有任何已知 id 的元素，app.js 应安静跳过所有模块
    expect(document.querySelector('#nav-toggle')).toBeNull();
    expect(document.querySelector('#search-input')).toBeNull();
    expect(document.querySelector('.post-content')).toBeNull();
  });

  it('runs without errors when only Header is present', () => {
    setupPage(`
      <html>
        <body>
          <button id="theme-toggle">🌙</button>
          <button id="nav-toggle">☰</button>
          <div id="nav-links">
            <a class="nav-link" href="/">Home</a>
          </div>
        </body>
      </html>
    `);
    expect(document.getElementById('theme-toggle')).not.toBeNull();
    expect(document.getElementById('nav-toggle')).not.toBeNull();
  });
});