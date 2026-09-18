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
    category: z.string().default(''),
    tags: z.array(z.string()).default([]),
    redirect: z.string().optional(),    // URL 迁移重定向
    featuredImage: z.string().optional(), // SEO 专用封面图（替代 heroImage）
  }),
});

export const collections = { blog };
