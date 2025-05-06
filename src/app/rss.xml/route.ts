import { getSortedPostsData } from '@/lib/posts';
import { generateRssFeed } from '@/lib/rss';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const posts = await getSortedPostsData();
    const rssFeed = generateRssFeed(posts);

    return new NextResponse(rssFeed, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
} 