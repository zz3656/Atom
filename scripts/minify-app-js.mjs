// 复制 src/scripts/app.js → public/js/app.js，再用 esbuild 压缩覆盖。
//
// 为什么源文件放在 src/scripts/ 而不是 public/js/？
//   public/ 下的文件会被 Astro 原样复制到 dist/，不会经过 Vite/esbuild 处理。
//   把"开发源"放在 src/scripts/，"构建产物"放在 public/js/，
//   这样可以反复构建（不会基于压缩版本再次压缩），
//   同时源代码仍受 ESLint/Prettier 控制。
//
// 为什么需要在 build 之前跑（prebuild 而不是 postbuild）？
//   public/ 下的文件会被 Astro 原样复制到 dist/，但 public/js/app.js
//   不存在（.gitignore 排除）。本脚本从 src/scripts/app.js 生成并
//   esbuild 压缩到 public/js/app.js 让 Astro build 时能找到。

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
// (子路径兼容逻辑已移除：dist/<base>/js/app.js 是冗余产物，
//  HTML 引用 /<base>/js/app.js 对应 dist/js/app.js，已足够)