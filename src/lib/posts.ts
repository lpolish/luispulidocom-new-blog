import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import math from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import { rehypeStoreCodeContent } from './rehypeStoreCodeContent';
import remarkGfm from 'remark-gfm';
import { rehypeReferences } from './rehypeReferences';

import { rehypeYoutubeEmbed } from './rehypeYoutubeEmbed';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  isFeatured?: boolean;
  references?: Map<string, { url: string; title?: string }>;
}

export async function getSortedPostsData(): Promise<Post[]> {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const matterResult = matter(fileContents);
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
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const allPosts = await getSortedPostsData();
  return allPosts.filter((post) => post.isFeatured).slice(0, 4);
}

export async function getAllPostSlugs() {
  try {
    const fileNames = await fs.readdir(postsDirectory);
    return fileNames.map((fileName) => ({
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    }));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostData(slug: string): Promise<Post> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    // Store extracted references
    let extractedReferences: Map<string, { url: string; title?: string }> | undefined;
    
    const remarkProcessor = remark()
      .use(math)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeYoutubeEmbed)
      .use(rehypeStoreCodeContent)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeReferences, {
        onReferencesExtracted: (references: Map<string, { url: string; title?: string }>) => {
          extractedReferences = references;
        }
      })
      .use(rehypeStringify);
    const processedContent = await remarkProcessor.process(matterResult.content);
    const contentHtml = processedContent.toString();
    return {
      slug,
      content: contentHtml,
      references: extractedReferences,
      ...(matterResult.data as {
        title: string;
        date: string;
        excerpt: string;
        tags: string[];
        isFeatured?: boolean;
      }),
    };
  } catch (error: any) {
    console.error(`Error processing post '${slug}':`, error);
    throw error;
  }
}