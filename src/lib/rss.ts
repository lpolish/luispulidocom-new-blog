import { Post } from './posts';

export function generateRssFeed(posts: Post[]): string {
  const baseUrl = 'https://luispulido.com';
  
  const rssItems = posts.map((post) => {
    const postUrl = `${baseUrl}/blog/${post.slug}`;
    return `
      <item>
        <guid>${postUrl}</guid>
        <title>${post.title}</title>
        <link>${postUrl}</link>
        <description><![CDATA[${post.excerpt}]]></description>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        ${post.tags.map(tag => `<category>${tag}</category>`).join('\n')}
      </item>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Luis Pulido's Blog</title>
        <link>${baseUrl}</link>
        <description>Articles on networking, AI, science, and technical topics</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
        ${rssItems}
      </channel>
    </rss>`;
} 