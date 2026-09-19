// Fix Astro's protocol-relative URL bug when base=''.
// Astro compiles href="/xxx" as href="//xxx" (protocol-relative).
// We restore them to href="/xxx" for root-hosted sites.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const distDir = './dist';
let fixed = 0;

/**
 * Check if a path segment looks like a domain, IP, or trusted protocol-relative URL.
 * Returns true if it should NOT be fixed.
 */
function looksLikeDomainOrTrustedURL(path) {
  // Standard domain: word.word (e.g. example.com, cdn.cloudflare.com)
  if (/^[a-zA-Z0-9]([a-zA-Z0-9_-]*\.)+[a-zA-Z]{2,}/.test(path)) {
    return true;
  }
  // IP address (IPv4): digits.digits.digits.digits
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(path)) {
    return true;
  }
  // IP with port
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+/.test(path)) {
    return true;
  }
  // Trusted CDNs that legitimately use protocol-relative URLs
  const trustedCDNs = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdnjs.cloudflare.com',
    'unpkg.com',
  ];
  for (const cdn of trustedCDNs) {
    if (path.startsWith(cdn)) {
      return true;
    }
  }
  return false;
}

function fixFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  // Match href="//xxx" where xxx is NOT a domain/URL
  content = content.replace(/href="\/\/([a-zA-Z0-9_\/\u4e00-\u9fff\-]+)/g, (match, path) => {
    if (looksLikeDomainOrTrustedURL(path)) {
      return match; // keep as-is
    }
    fixed++;
    return `href="/${path}"`;
  });
  writeFileSync(filePath, content, 'utf-8');
}

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry !== '_astro' && entry !== '_assets') {
        walk(fullPath);
      }
    } else if (entry === 'index.html') {
      fixFile(fullPath);
    }
  }
}

walk(distDir);
if (fixed > 0) {
  console.log(`Fixed ${fixed} protocol-relative link(s).`);
}
