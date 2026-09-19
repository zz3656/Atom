// 复制 src/scripts/app.js → public/js/app.js，再用 esbuild 压缩覆盖。
//
// 为什么源文件放在 src/scripts/ 而不是 public/js/？
//   public/ 下的文件会被 Astro 原样复制到 dist/，不会经过 Vite/esbuild 处理。
//   把"开发源"放在 src/scripts/，"构建产物"放在 public/js/，
//   这样可以反复构建（不会基于压缩版本再次压缩），
//   同时源代码仍受 ESLint/Prettier 控制。
//
// 为什么需要在 build 之前跑（prebuild 而不是 postbuild）？
//   Astro 7 在部署到子路径（如 GitHub Pages /repo）时，会把页面路由放到
//   dist/<base>/ 下，但 public/ 目录的内容会原样复制到 dist/js/ —
//   二者不对齐，会导致 <script src="/<base>/js/app.js"> 找不到文件。
//   本脚本通过 env DEPLOY_TARGET + REPO_NAME 推导 base，提前把 app.js
//   放到 public/<base>/js/app.js，让 Astro 把两个位置都生成出来。
//   因此必须在 astro build 之前执行（package.json prebuild 链）。

import { build } from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SRC = join(process.cwd(), 'src', 'scripts', 'app.js');
const DST = join(process.cwd(), 'public', 'js', 'app.js');

if (!existsSync(SRC)) {
  console.log('No src/scripts/app.js found, skipping minification');
  process.exit(0);
}

// 确保目标目录存在（首次克隆的仓库因 .gitignore 排除 public/js/，可能没有该目录）
mkdirSync(dirname(DST), { recursive: true });

const before = statSync(SRC).size;

// 先把开发版拷贝到 public/js/（根路径部署场景需要）
copyFileSync(SRC, DST);

try {
  await build({
    entryPoints: [DST],
    outfile: DST,
    allowOverwrite: true,
    bundle: true,
    minify: true,
    target: 'es2020',
    legalComments: 'none',
    logLevel: 'silent',
  });
  const after = statSync(DST).size;
  const pct = (((before - after) / before) * 100).toFixed(1);
  console.log(`Minified app.js: ${before} → ${after} bytes (${pct}% smaller)`);
} catch (err) {
  console.warn('app.js minification failed:', err.message);
  // 失败时把开发版留下，保证 dist 至少能跑
}

// ===== 子路径兼容：把压缩后的 app.js 复制到 public/<base>/js/app.js =====
// 与 astro.config.mjs 的 base 计算保持一致：仅当 DEPLOY_TARGET=github 时使用子路径
const isGitHubPages =
  process.env.DEPLOY_TARGET === 'github' || process.env.PAGES_ENV === 'true';
const REPO_NAME = process.env.REPO_NAME || 'Atom';
const base = isGitHubPages ? `/${REPO_NAME}` : '';

if (base) {
  const baseDst = join(process.cwd(), 'public', base, 'js', 'app.js');
  mkdirSync(dirname(baseDst), { recursive: true });
  copyFileSync(DST, baseDst);
  console.log(`Also copied to public${base}/js/app.js (for GitHub Pages subpath)`);
}