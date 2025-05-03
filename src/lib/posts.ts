import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import math from 'remark-math';
import html from 'remark-html';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';

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

export async function getSortedPostsData(): Promise<Post[]> {
  try {
    // If directory doesn't exist in production build, return empty array
    const fileNames = await fs.readdir(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames.map(async (fileName) => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');

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
      })
    );

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const allPosts = await getSortedPostsData();
  return allPosts.filter((post: Post) => post.isFeatured).slice(0, 4);
}

export async function getAllPostSlugs() {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    return fileNames.map((fileName) => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<Post> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string with KaTeX and syntax highlighting
    const processedContent = await remark()
      .use(math)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeStringify)
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
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    throw error;
  }
} 