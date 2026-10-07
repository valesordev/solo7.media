import { defineCollection, z } from 'astro:content';

const artwork = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['photos', 'drawings', 'generative', 'other']),
    date: z.coerce.date(),
    description: z.string(),
    image: z.string(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { artwork };
