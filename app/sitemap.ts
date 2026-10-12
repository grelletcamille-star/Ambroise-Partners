import type { MetadataRoute } from 'next';
import { POSTS } from './insights/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.ambroisepartners.com';

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/insights`, lastModified: new Date(POSTS[0]?.date ?? Date.now()), changeFrequency: 'weekly', priority: 0.8 },
    ...POSTS.map((p) => ({ url: `${baseUrl}/insights/${p.slug}`, lastModified: new Date(p.date), changeFrequency: 'yearly' as const, priority: 0.6 })),
    { url: `${baseUrl}/legal`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
