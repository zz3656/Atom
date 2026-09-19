import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,js}'],
    environment: 'node',
    // 客户端脚本测试用 `// @vitest-environment jsdom` 在文件顶部声明
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/utils/**'],
      exclude: ['src/utils/date.ts', 'src/utils/path.ts', 'src/utils/collection.ts'],
    },
  },
});
