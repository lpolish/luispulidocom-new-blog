import fs from 'fs';
import path from 'path';
import { getSortedPostsData } from '../src/lib/posts';
import { generateRssFeed } from '../src/lib/rss';

async function main() {
  const posts = await getSortedPostsData();
  const rss = generateRssFeed(posts);
  const outputPath = path.join(process.cwd(), 'public/rss.xml');
  fs.writeFileSync(outputPath, rss);
  console.log('RSS feed generated:', outputPath);
}

main();
