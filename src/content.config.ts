import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    featuredImage: z.string().optional(), // SEO 专用封面图（优先于 heroImage 用于 OG）
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
    reward: z.boolean().optional(), // 是否在文末显示打赏码
    draft: z.boolean().optional(), // 草稿（构建时过滤）
  }),
});

export const collections = { blog };
