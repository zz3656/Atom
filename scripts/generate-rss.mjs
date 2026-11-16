/**
 * 生成 RSS（dist/rss.xml）—— postbuild 阶段运行。
 *
 * 文章清单与 frontmatter 解析统一走 scripts/lib/blog-posts.mjs，
 * 不再自己维护一套正则，避免与搜索索引/页面渲染产生规则漂移。
 *
 * 注意：搜索索引不在这里生成（它是 prebuild 阶段的事，见
 * scripts/generate-search-index.mjs）。历史 bug：索引在 postbuild 写 public/，
 * 而 astro build 早已复制完 public/，导致索引永远落后一次构建。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadPosts } from './lib/blog-posts.mjs';

function escapeXml(str) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return String(str).replace(/[&<>"']/g, function (c) {
    return map[c] || c;
  });
}

var distDir = join(process.cwd(), 'dist');

// 自动从 dist/index.html 提取站点 URL（与 astro.config.mjs 保持一致）
var siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  try {
    var indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
    var ogMatch = indexHtml.match(/property="og:url"[^>]*content="([^"]+)"/);
    if (ogMatch) {
      siteUrl = ogMatch[1];
    }
  } catch (e) {
    // fallback to default
  }
}
if (!siteUrl) siteUrl = 'https://zz3656.github.io';
// 重要: siteUrl 已包含 base (从 og:url 提取的完整 URL)，不要再叠加 prefix。
// 之前的 bug: siteUrl + prefix 导致 /Atom//Atom/ 双前缀。

// --- Generate RSS ---
var posts = loadPosts();

var items = posts
  .map(function (p) {
    var url = siteUrl.replace(/\/$/, '') + '/blog/' + p.slug + '/';
    var lastBuild = p.updatedDate
      ? '\n      <lastBuildDate>' + p.updatedDate.toUTCString() + '</lastBuildDate>'
      : '';
    // 为 RSS 阅读器提供全文（包装在 CDATA 中避免 XML 转义问题）
    var fullContent = p.content
      ? '\n      <content:encoded><![CDATA[' + p.content + ']]></content:encoded>'
      : '';
    return [
      '    <item>',
      '      <title>' + escapeXml(p.title) + '</title>',
      '      <link>' + url + '</link>',
      '      <guid>' + url + '</guid>',
      '      <pubDate>' + p.pubDate.toUTCString() + '</pubDate>',
      lastBuild,
      '      <description>' + escapeXml(p.description) + '</description>',
      p.category ? '      <category>' + escapeXml(p.category) + '</category>' : '',
      p.tags && p.tags.length > 0
        ? '      <category>' +
          p.tags.map(escapeXml).join('</category>\n      <category>') +
          '</category>'
        : '',
      fullContent,
      '    </item>',
    ]
      .filter(Boolean)
      .join('\n');
  })
  .join('\n');

var rss = [
  '<?xml version="1.0" encoding="UTF-8" ?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
  '  <channel>',
  '    <title>' + (process.env.SITE_TITLE || 'Atom Blog') + '</title>',
  '    <description>' +
    escapeXml(process.env.SITE_DESCRIPTION || 'A modern, lightweight blog built with Astro') +
    '</description>',
  '    <link>' + siteUrl.replace(/\/$/, '') + '/</link>',
  '    <atom:link href="' + siteUrl.replace(/\/$/, '') + '/rss.xml" rel="self" type="application/rss+xml" />',
  items,
  '  </channel>',
  '</rss>',
].join('\n');

writeFileSync('dist/rss.xml', rss, 'utf-8');
console.log(`RSS generated: dist/rss.xml (${posts.length} item(s))`);
