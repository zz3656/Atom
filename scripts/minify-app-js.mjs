// 复制 src/scripts/app.js → public/js/app.js，再用 esbuild 压缩覆盖。
//
// 为什么源文件放在 src/scripts/ 而不是 public/js/？
//   public/ 下的文件会被 Astro 原样复制到 dist/，不会经过 Vite/esbuild 处理。
//   把"开发源"放在 src/scripts/，"构建产物"放在 public/js/，
//   这样可以反复构建（不会基于压缩版本再次压缩），
//   同时源代码仍受 ESLint/Prettier 控制。

import { build } from 'esbuild';
import { copyFileSync, existsSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join(process.cwd(), 'src', 'scripts', 'app.js');
const DST = join(process.cwd(), 'public', 'js', 'app.js');

if (!existsSync(SRC)) {
  console.log('No src/scripts/app.js found, skipping minification');
  process.exit(0);
}

const before = statSync(SRC).size;

// 先把开发版拷贝到 public/js/，Astro 会复制到 dist/
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
