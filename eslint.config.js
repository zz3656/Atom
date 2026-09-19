// ESLint 配置
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import astroPlugin from 'eslint-plugin-astro';

export default [
  // 全局忽略
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'public/**',
      'coverage/**',
      'scripts/**', // CLI 脚本有自己风格
      'astro-plugins/**', // Remark 插件独立
    ],
  },

  // TypeScript / Astro 文件
  {
    files: ['**/*.ts', '**/*.astro'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // 仅报告 unused 变量，不阻止构建
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-undef': 'off', // TS 已经检查
      'no-unused-vars': 'off', // 由 TS 规则处理
    },
  },

  // Astro 文件特定规则
  ...astroPlugin.configs.recommended,

  // 测试文件放宽
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
