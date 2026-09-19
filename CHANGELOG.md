# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

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
