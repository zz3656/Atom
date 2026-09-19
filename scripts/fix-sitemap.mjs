// 用文章的 updatedDate 替换 sitemap 中博客文章的 lastmod
// 默认 sitemap 集成使用构建时间作为 lastmod，不准确

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const blogDir = join(process.cwd(), 'src', 'content', 'blog');

/**
 * 收集所有文章的 ISO 日期字符串（updatedDate 优先，回退到 pubDate）
 */
async function collectArticleDates() {
  if (!existsSync(blogDir)) return {};
  const files = readdirSync(blogDir).filter((f) => f.endsWith('.md'));
  const articles = {};
  for (const file of files) {
    const content = await readFile(join(blogDir, file), 'utf-8');
    const slug = file.replace(/\.md$/, '');
    const fmMatch = content.match(/^---([\s\S]*?)---/);
    if (!fmMatch) continue;
    const fm = fmMatch[1];
    const updatedMatch = fm.match(/^updatedDate:\s*(.+)$/m);
    const pubMatch = fm.match(/^pubDate:\s*(.+)$/m);
    const dateStr = updatedMatch ? updatedMatch[1].trim() : pubMatch ? pubMatch[1].trim() : null;
    if (dateStr) {
      articles[slug] = new Date(dateStr).toISOString();
    }
  }
  return articles;
}

/**
 * 为 sitemap 中每个 /blog/<slug>/ 插入 <lastmod>
 */
function injectLastmod(content, articles) {
  let added = 0;
  let updated = content;
  for (const [slug, isoDate] of Object.entries(articles)) {
    // 匹配 <url><loc>.../blog/<slug>/</loc>[可选 changefreq]</url>
    const pattern = new RegExp(
      `(<url><loc>[^<]*\\/blog\\/${slug}\\/<\\/loc>(?:<changefreq>[^<]*<\\/changefreq>)?)(</url>)`,
      'g',
    );
    if (pattern.test(updated)) {
      updated = updated.replace(pattern, `$1<lastmod>${isoDate}</lastmod>$2`);
      added++;
    }
  }
  return { content: updated, added };
}

async function main() {
  // 1. 读取文章日期
  const articles = await collectArticleDates();
  console.log(`Loaded ${Object.keys(articles).length} article dates`);

  // 2. 读取 sitemap
  const sitemapPath = join(distDir, 'sitemap-0.xml');
  if (!existsSync(sitemapPath)) {
    console.log('No sitemap-0.xml found, skipping');
    return;
  }

  const content = readFileSync(sitemapPath, 'utf-8');
  const { content: newContent, added } = injectLastmod(content, articles);

  if (added > 0) {
    writeFileSync(sitemapPath, newContent, 'utf-8');
  }
  console.log(`Added ${added} lastmod entries to sitemap`);
}

main().catch((err) => {
  console.error('fix-sitemap failed:', err);
  process.exit(1);
});
