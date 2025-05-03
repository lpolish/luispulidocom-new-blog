import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import math from 'remark-math';
import html from 'remark-html';
import rehypeKatex from 'rehype-katex';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  isFeatured?: boolean;
}

export function getSortedPostsData(): Post[] {
  // If directory doesn't exist in production build, return empty array
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...(matterResult.data as { 
        title: string; 
        date: string; 
        excerpt: string; 
        tags: string[];
        isFeatured?: boolean;
      }),
      content: matterResult.content,
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getFeaturedPosts(): Post[] {
  const allPosts = getSortedPostsData();
  return allPosts.filter(post => post.isFeatured).slice(0, 4);
}

export function getAllPostSlugs() {
  // If directory doesn't exist in production build, return empty array
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string with KaTeX support
  const processedContent = await remark()
    .use(math)
    .use(html)
    .use(rehypeKatex)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the slug
  return {
    slug,
    content: contentHtml,
    ...(matterResult.data as { 
      title: string; 
      date: string; 
      excerpt: string; 
      tags: string[];
      isFeatured?: boolean;
    }),
  };
} 