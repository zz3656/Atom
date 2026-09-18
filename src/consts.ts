// Atom Blog — 站点配置
// 灵感来自电影《铁甲钢拳》(Real Steel) 中的机器人 Atom
//
// ★ 客制化指南 ★
// 只需修改此处，即可全局更新站点信息、Logo、Favicon 等

export const SITE_TITLE = 'Atom Blog';           // 站点标题（SEO 标题、OG 标签、RSS 名称等）
export const SITE_NAME = 'Atom';                 // 导航栏显示的名称（短名称，可用于 Logo 替换后仅显示文字）
export const SITE_DESCRIPTION = 'A modern, lightweight blog built with Astro — clean, fast, elegant';
export const AUTHOR = 'zz3656';

// Logo & Favicon
// - SITE_LOGO_SVG: 导航栏左侧的 SVG Logo 代码（内联 SVG string）
// - SITE_FAVICON: Favicon 文件路径（放在 public/ 目录下）
export const SITE_LOGO_SVG = `<svg class="atom-icon" viewBox="0 0 32 32" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="14" fill="url(#iconBg)"/>
  <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="url(#iconRing)" stroke-width="1.5" transform="rotate(30 16 16)"/>
  <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="url(#iconRing)" stroke-width="1.5" transform="rotate(-30 16 16)"/>
  <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" stroke="url(#iconRing)" stroke-width="1.5" transform="rotate(90 16 16)"/>
  <circle cx="16" cy="16" r="2.5" fill="#fff"/>
  <defs>
    <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
    <linearGradient id="iconRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e0e7ff"/>
      <stop offset="100%" style="stop-color:#a5b4fc"/>
    </linearGradient>
  </defs>
</svg>`;
export const SITE_FAVICON = '/favicon.svg';       // Favicon 路径（对应 public/favicon.svg）

export const SOCIAL_LINKS = {
  github: 'https://github.com/zz3656',
  twitter: '',
  email: '',
};
