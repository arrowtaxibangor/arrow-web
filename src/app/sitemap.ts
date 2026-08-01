import { MetadataRoute } from 'next';

import { listPublishedPages } from '@/lib/supabase/cms';
import { listBlogPosts } from '@/lib/supabase/blog';

const BASE_URL = 'https://www.arrow.taxi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/luxury`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  let cmsRoutes: MetadataRoute.Sitemap = [];
  try {
    const pages = await listPublishedPages();
    cmsRoutes = pages
      .filter((page) => page.slug !== 'home')
      .map((page) => ({
        url: `${BASE_URL}/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (err) {
    console.error('[sitemap] Failed to fetch CMS pages:', err);
  }

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await listBlogPosts({ publishedOnly: true });
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error('[sitemap] Failed to fetch blog posts:', err);
  }

  return [...staticRoutes, ...cmsRoutes, ...blogRoutes];
}
