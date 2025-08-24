import { NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

export async function GET() {
  try {
    const baseUrl = 'https://luispulido.com';
    const posts = await getSortedPostsData();
    
    // Get current date in ISO format for pages without specific modification dates
    const currentDate = new Date().toISOString();
    
    const staticRoutes = [
      { url: baseUrl, lastMod: currentDate, changeFreq: 'daily', priority: 1.0 },
      { url: `${baseUrl}/about`, lastMod: currentDate, changeFreq: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/blog`, lastMod: currentDate, changeFreq: 'daily', priority: 0.9 },
      { url: `${baseUrl}/chess`, lastMod: currentDate, changeFreq: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/contact`, lastMod: currentDate, changeFreq: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/privacy`, lastMod: currentDate, changeFreq: 'yearly', priority: 0.3 },
      { url: `${baseUrl}/random`, lastMod: currentDate, changeFreq: 'weekly', priority: 0.5 },
      { url: `${baseUrl}/terms-of-service`, lastMod: currentDate, changeFreq: 'yearly', priority: 0.3 },
    ];
    
    // Generate post routes
    const postRoutes = posts.map((post) => 
      `<url>
        <loc>${baseUrl}/blog/${post.slug}</loc>
        <lastmod>${new Date(post.date).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>`
    ).join('');

    // Generate static routes XML
    const staticXml = staticRoutes.map(route => 
      `<url>
        <loc>${route.url}</loc>
        <lastmod>${route.lastMod}</lastmod>
        <changefreq>${route.changeFreq}</changefreq>
        <priority>${route.priority}</priority>
      </url>`
    ).join('');

    // Build the complete XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${postRoutes}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
