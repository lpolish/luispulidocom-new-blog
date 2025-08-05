import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const rssPath = path.join(process.cwd(), 'public/rss.xml');
const outputPath = path.join(process.cwd(), 'public/recent-posts.json');

function main() {
  if (!fs.existsSync(rssPath)) {
    console.error('RSS file not found:', rssPath);
    process.exit(1);
  }
  const xml = fs.readFileSync(rssPath, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false });
  const rss = parser.parse(xml);
  const items = rss.rss.channel.item;
  // Ensure items is always an array
  const posts = Array.isArray(items) ? items : [items];
  // Get most recent 8 posts
  const recentPosts = posts.slice(0, 8).map((item: any) => ({
    slug: item.link.replace('https://luispulido.com/blog/', ''),
    title: item.title,
    date: item.pubDate,
    excerpt: item.description,
    // Optionally add more fields if needed
  }));
  fs.writeFileSync(outputPath, JSON.stringify(recentPosts, null, 2));
  console.log('Recent posts JSON generated:', outputPath);
}

main();
