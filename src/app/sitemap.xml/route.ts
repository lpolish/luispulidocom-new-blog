import { NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

export async function GET() {
  const baseUrl = 'https://luispulido.com';
  const posts = await getSortedPostsData();
  const staticRoutes = [
    { url: baseUrl, lastMod: new Date().toISOString(), changeFreq: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastMod: new Date().toISOString(), changeFreq: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastMod: new Date().toISOString(), changeFreq: 'daily', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastMod: new Date().toISOString(), changeFreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastMod: new Date().toISOString(), changeFreq: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/terms-of-service`, lastMod: new Date().toISOString(), changeFreq: 'yearly', priority: 0.5 },
  ];
  const postRoutes = posts.map((post) => `
    <url>
      <loc>${baseUrl}/blog/${post.slug}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join('');

  const staticXml = staticRoutes.map(route => `
    <url>
      <loc>${route.url}</loc>
      <lastmod>${route.lastMod}</lastmod>
      <changefreq>${route.changeFreq}</changefreq>
      <priority>${route.priority}</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticXml}
      ${postRoutes}
    </urlset>
  `;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
