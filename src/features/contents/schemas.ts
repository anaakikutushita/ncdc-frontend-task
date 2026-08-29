import { z } from "zod";

export const ContentSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(50),
  body: z.string().min(10).max(2000),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Content = z.infer<typeof ContentSchema>;
