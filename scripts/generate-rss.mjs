import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { markdownToPlainText, stripFrontmatter } from '../src/utils/markdown-strip.js';

function escapeXml(str) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
  return String(str).replace(/[&<>"']/g, function (c) {
    return map[c] || c;
  });
}

function parseFrontmatter(content) {
  var parts = content.split('---');
  if (parts.length < 3) return {};
  var fm = {};
  var lines = parts[1].split('\n');
  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(/^(\w[\w\-]*):\s*(.*)$/);
    if (match) {
      var val = match[2].trim();
      if (val.indexOf('[') === 0 && val.lastIndexOf(']') === val.length - 1) {
        val = val
          .slice(1, -1)
          .split(',')
          .map(function (s) {
            return s.trim().replace(/^["']|["']$/g, '');
          })
          .filter(function (s) {
            return s;
          });
      } else if (val[0] === '"' && val[val.length - 1] === '"') {
        val = val.slice(1, -1);
      }
      fm[match[1]] = val;
    }
  }
  return fm;
}

// 自动从 dist/_astro/ 目录获取 base 路径（Astro 构建产物）
var distDir = join(process.cwd(), 'dist');
var astroFiles = readdirSync(distDir).filter(function (f) {
  return f.startsWith('_astro');
});
var base = '/';
if (astroFiles.length > 0) {
  // 通过 dist/index.html 提取 base 路径
  try {
    var indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');
    var hrefMatch = indexHtml.match(/href="\/([^\/"']*\/_astro)/);
    if (hrefMatch) {
      base = '/' + hrefMatch[1].replace('/_astro', '');
    }
  } catch (e) {
    // fallback to /
  }
}

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
var prefix = base;

// --- Generate RSS + Search Index ---
var blogDir = 'src/content/blog';
var files = readdirSync(blogDir).filter(function (f) {
  return f.endsWith('.md');
});
var posts = files
  .map(function (f) {
    var fullContent = readFileSync(join(blogDir, f), 'utf-8');
    var fm = parseFrontmatter(fullContent);
    // 提取正文（复用 src/utils/markdown-strip.js 的实现）
    var body = stripFrontmatter(fullContent);
    return {
      title: fm.title || '',
      description: fm.description || '',
      pubDate: new Date(fm.pubDate),
      updatedDate: fm.updatedDate ? new Date(fm.updatedDate) : null,
      slug: f.replace('.md', ''),
      category: fm.category || '',
      tags: fm.tags || [],
      draft: fm.draft === true || fm.draft === 'true',
      content: body,
    };
  })
  .filter(function (p) {
    return !p.draft;
  })
  .sort(function (a, b) {
    return b.pubDate - a.pubDate;
  });

var items = posts
  .map(function (p) {
    var url = siteUrl + prefix + '/blog/' + p.slug + '/';
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
  '    <link>' + siteUrl + prefix + '/</link>',
  '    <atom:link href="' + siteUrl + prefix + '/rss.xml" rel="self" type="application/rss+xml" />',
  items,
  '  </channel>',
  '</rss>',
].join('\n');

writeFileSync('dist/rss.xml', rss, 'utf-8');
console.log('RSS generated: dist/rss.xml');

// --- Generate Search Index ---
// 从正文提取纯文本用于搜索（去除 Markdown 标记，函数从 src/utils/markdown-strip.js 共享）
var searchIndex = posts.map(function (p) {
  var bodyText = markdownToPlainText(p.content || '');
  return {
    slug: p.slug,
    title: p.title,
    description: p.description || '',
    pubDate: p.pubDate.toISOString(),
    content: (p.title + ' ' + p.description + ' ' + bodyText).toLowerCase(),
    categories: (p.category || '').toLowerCase(),
    tags: (p.tags || []).map(function (t) {
      return t.toLowerCase();
    }),
  };
});
// 写入 public/_assets/，Astro 构建时会自动复制到 dist/
var publicAssetsDir = join(process.cwd(), 'public', '_assets');
if (!existsSync(publicAssetsDir)) {
  mkdirSync(publicAssetsDir, { recursive: true });
}
writeFileSync(join(publicAssetsDir, 'search-index.json'), JSON.stringify(searchIndex));
console.log('Search index generated: public/_assets/search-index.json');
