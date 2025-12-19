import { z } from 'zod';
import { insertInquirySchema, contentBlocks, inquiries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  content: {
    list: {
      method: 'GET' as const,
      path: '/api/content',
      responses: {
        200: z.record(z.string(), z.any()), // Returns object like { hero: {...}, services: [...] }
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/content',
      input: z.object({
        key: z.string(),
        value: z.any(),
      }),
      responses: {
        200: z.custom<typeof contentBlocks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  inquiries: {
    create: {
      method: 'POST' as const,
      path: '/api/inquiries',
      input: insertInquirySchema,
      responses: {
        201: z.custom<typeof inquiries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/inquiries',
      responses: {
        200: z.array(z.custom<typeof inquiries.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
