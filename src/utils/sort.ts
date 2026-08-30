import { type Content } from '@/features/contents/schemas';

export const sortContentsByDesc = (contents: Content[]) => {
  return [...contents].sort((a, b) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
};
