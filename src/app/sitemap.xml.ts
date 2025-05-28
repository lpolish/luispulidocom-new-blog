import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { Post } from '@/lib/posts';

type ChangeFreq = 'daily' | 'monthly' | 'always' | 'hourly' | 'weekly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://luispulido.com';
  
  // Get all blog posts
  const posts = await getSortedPostsData();
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFreq,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as ChangeFreq,
      priority: 0.9,
    },
  ];

  // Blog post routes
  const postRoutes = posts.map((post: Post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as ChangeFreq,
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}