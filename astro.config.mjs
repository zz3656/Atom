import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import remarkImgLazy from './astro-plugins/remark-img-lazy.mjs';
import rehypeTableScroll from './astro-plugins/rehype-table-scroll.mjs';
import themeLoader from './astro-plugins/theme-loader.mjs';
import { loadPosts } from './scripts/lib/blog-posts.mjs';

// 部署目标自动检测:
//   DEPLOY_TARGET=github → GitHub Pages（需要仓库名前缀）
//   DEPLOY_TARGET=cf    → Cloudflare Pages（根路径，无前缀）
//   不设置               → 自动检测：如果有 PAGES_ENV 则视为 GitHub Pages
const isGitHubPages = process.env.DEPLOY_TARGET === 'github' || process.env.PAGES_ENV === 'true';

// GitHub Pages 自动从仓库名推导 base 路径
// 例如: zz3656/Atom → base='/Atom'
const REPO_NAME = process.env.REPO_NAME || 'Atom';

// Cloudflare Pages 使用根路径
const base = isGitHubPages ? `/${REPO_NAME}` : '';

// site: 部署目标的实际域名
const site = isGitHubPages
  ? `https://${process.env.GITHUB_USER || 'zz3656'}.github.io/${REPO_NAME}`
  : `https://${process.env.CF_DOMAIN || 'atom.inte8.top'}`;

// sitemap 的 lastmod：文章页用 updatedDate ?? pubDate，其余页面用最新文章日期。
// 之前是靠 postbuild 正则往 XML 里插 <lastmod>（还插在 <changefreq> 之后，顺序不合 XSD），
// 现在直接交给集成序列化，顺带把那支脆弱的脚本删掉。
const posts = loadPosts();
const postLastmod = new Map(
  posts.map((p) => [`/blog/${p.slug}/`, (p.updatedDate ?? p.pubDate).toISOString()]),
);
const newestPostDate = posts.length
  ? new Date(Math.max(...posts.map((p) => p.pubDate.getTime()))).toISOString()
  : new Date().toISOString();

function lastmodFor(url) {
  const pathname = new URL(url).pathname;
  const relativePath =
    base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
  return postLastmod.get(relativePath) ?? postLastmod.get(`${relativePath}/`) ?? newestPostDate;
}

export default defineConfig({
  integrations: [
    sitemap({
      changefreq: 'weekly',
      // 404 页面不该进 sitemap
      filter: (page) => !page.includes('/404'),
      serialize: (item) => ({ ...item, lastmod: lastmodFor(item.url) }),
    }),
  ],
  site,
  base,
  // 统一带尾斜杠：内链（path.ts）、canonical、sitemap 三者口径一致，少一次 301
  trailingSlash: 'always',
  // HTML 压缩优化
  build: {
    compressHTML: true,
    // 项目所有 CSS 都内联到 HTML，省一次 HTTP 请求（适合博客这种小项目）
    inlineStylesheets: 'always',
  },
  // 启用 Vite 预构建以加快冷启动
  vite: {
    plugins: [themeLoader()],
    build: {
      // CSS 代码分割：每个页面只加载用到的 CSS
      cssCodeSplit: true,
    },
    // 预构建常用依赖
    optimizeDeps: {
      include: ['astro/runtime/client/dev-toolbar'],
    },
  },

  markdown: {
    // Astro 5+ 的写法：统一走 unified() 处理器
    // （旧的 markdown.remarkPlugins 顶层写法已废弃）
    processor: unified({
      remarkPlugins: [remarkImgLazy],
      rehypePlugins: [rehypeTableScroll],
    }),
    shikiConfig: {
      // Shiki 输出两套颜色，CSS 变量 --shiki-dark 控制切换（见 src/styles/_modules/_post.css）
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
