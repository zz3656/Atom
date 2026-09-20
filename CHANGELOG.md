# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

### Added

- `REPO_URL` in `src/consts.ts` for Footer project source link (separate from `SOCIAL_LINKS.github`)
- `data-has-dark` attribute on theme options (single-mode theme support)
- Theme scaffold CLI: `npm run theme:create <id>` + `--no-dark` flag
- `data-theme` / `data-mode` dual-attribute theme system with build-time injection (FOUC-free)
- Build plugin `astro-plugins/theme-loader.mjs` (scans `src/themes/` at build)
- `docs/THEMING.md` — complete theme development guide
- `<noscript>` graceful degradation fallback (planned)
- `inlineStylesheets: 'always'` — eliminates one HTTP request per page (planned)

### Changed

- Simplified multi-theme system: project ships with only `atom-default`; other themes moved to separate repo (`atom-themes/`)
- Theme picker UI replaced with simple light/dark toggle button
- Header dropdown menu (`.theme-picker`/`.theme-menu`) removed; click directly toggles mode
- Header code: -50 lines; app.js theme code: -135 → ~30 lines; `_header.css`: -106 lines
- Net: -498 lines of code (`+58 / -556`)
- Footer rewritten: `🐙 GitHub` (user-customizable via `SOCIAL_LINKS.github`) + `© 2026 Atom` (hardcoded framework brand → `REPO_URL`)
- RSS Feed URL double-prefix bug fixed (online verified): `siteUrl + prefix` → `siteUrl.replace(/\/$/, '') + path`
- search-result URL double-trailing-slash bug fixed
- Hero button href `/Atom//blog` (404) fixed → `/Atom/blog` (works)
- Image zoom overlay: aria-supplied alt via original `<img alt>` (not blank placeholder)
- TOC desktop: `top: calc(header + 1.5rem)` → `top: 50% + translateY(-50%)` (vertically centered)
- Coverage config: removed exclude of `date.ts`/`path.ts`/`collection.ts` (P0-18)
- `collection.ts` now has dedicated `tests/collection.test.ts` (was 0% coverage)
- minify-app-js.mjs: removed redundant `public/<base>/` copy branch (was creating unused `dist/Atom/` files)
- Removed `scripts/fix-links.mjs` (was dead code: Astro 7 auto-fixes protocol-relative URLs)
- Added `canonical` URL link to all pages
- 404 page `og:url` no longer points to non-existent `/404/` (uses `pageUrl={Astro.site}`)

### Removed

- Dead code: `formatFullDate` (only used in tests), `isRoot()` (never called)
- `dist/Atom/js/app.js` (10KB unused file in production builds)
- Sepia & Solarized themes from `src/themes/` (moved to `atom-themes/` standalone repo)

### Security

- RSS injection defense: `escapeXml()` on title/description in RSS items
- Image-zoom overlay: uses original `<img>` alt via `openZoom(src, alt)` (not blank)

## [Unreleased - Optimization & Refactor]

### Changed

- Renamed project from `Atom-blog` to `Atom` (directory, package name, docs, URLs, code references)

### Added

- Atom-style robot favicon (SVG)
- Dark mode toggle with user preference memory
- Reading progress bar on article pages
- Previous / Next article navigation
- 404 page with Atom theme design
- Reward (donation) QR code support

### Changed

- Renamed from `astro-blog` to `Atom`
- All `from app.*` imports → root-level imports

### Fixed

- CSS import path in layouts
- Frontmatter date sorting in blog listing

---

## [1.0.0] — 2026-09-13

### Added

- ⚡ Astro-powered static blog
- 🌙 Dark mode (CSS variable based)
- 📱 Responsive design (mobile / tablet / desktop)
- 📝 Markdown writing with Shiki syntax highlighting (GitHub Dark)
- 🏷️ Tag system with auto-display on cards
- 🔍 SEO optimization: Open Graph, Twitter Cards, JSON-LD
- 📄 RSS feed (auto-generated post-build)
- 🗺️ Sitemap (auto-generated post-build)
- 🤖 robots.txt
- 📖 Article detail layout with prev/next nav
- 💰 Optional reward section with WeChat / Alipay QR codes
- 📁 Content Collections API (type-safe frontmatter)
- 📸 Hero image support per article
- 🕐 Article update date display
- 🚀 GitHub Actions deploy workflow
- 🎨 Atom (Real Steel) themed favicon
- 📊 6 pages: home, blog list, 3 sample posts, about, 404
- 📦 ~50 KB total output (zero JS)
- 💯 Lighthouse 100 on all metrics
- 📄 Bilingual docs (README zh/en, DEVELOP.md)

### Tech Stack

- Astro 4.x
- TypeScript
- Shiki (code highlighting)
- CSS Variables (theming)
- GitHub Pages + Actions (deployment)

---

<div align="center">

**Made with ⚙️ by [Atom Blog](https://github.com/zz3656/Atom) · Powered by [Astro](https://astro.build)**

</div>

---

## [Unreleased - Optimization & Refactor]

### Added

- Reading time estimation with Chinese + English word counting
- Related posts recommendation (based on tag overlap + category match)
- Back-to-top button with smooth scroll + reduced-motion support
- Search results keyboard navigation (Arrow keys + Enter + ESC)
- Sitemap `<lastmod>` based on article `updatedDate`/`pubDate`
- RSS full content via `<content:encoded>` (CDATA)
- npm shortcuts: `npm run new`, `npm run list`, `npm run test`, `npm run check`
- CI workflow for type check + tests + build verification
- Unit test infrastructure (Vitest) with 17 test cases
- `featuredImage` frontmatter field for SEO OG images
- `draft` frontmatter field — drafts are filtered from listings, RSS, and sitemap
- Theme FOUC prevention (script moved to `<head>`)
- Smooth theme switch transition with `prefers-reduced-motion` support
- `<HeroIcon />` Astro component (extracted from inline SVG)

### Changed

- **Security**: Search results now use `DOM API` + `escapeHTML` to prevent XSS
- **Performance**: Search/Theme JS extracted to `public/js/search.js` (~5KB external file)
- **Performance**: Search index loaded lazily on first focus/keystroke
- **Refactor**: `path.ts` unified with single `withBase()` helper (removed redundant `blogSlug`, `blogPath`, `pageUrl`)
- **Refactor**: Centralized `getPublishedPosts()` in `utils/collection.ts`
- **Refactor**: All `<img>` tags have explicit `width`/`height` to prevent CLS
- **Refactor**: TypeScript strict mode + `npm run check` (0 errors, 0 warnings)
- **README**: Documented `featuredImage`, `draft` fields

### Removed

- Dead code: `createCategoryFilter`, `isRoot()`, unused `redirect` schema field, unused `FormattedDate` import in `PostCard`
