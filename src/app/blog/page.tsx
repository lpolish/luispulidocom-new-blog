import Link from 'next/link';
import { getSortedPostsData, type Post } from '@/lib/posts';
import { BlogList } from '@/components/BlogList';

export const metadata = {
  title: 'Blog | Luis Pulido',
  description: 'Articles on networking, AI, science, and technical topics',
};

export default async function Blog() {
  const allPosts = await getSortedPostsData();
  
  return (
    <div className="max-w-4xl mx-auto pt-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-textMuted text-lg">
          My thoughts, insights, and explorations on technical topics.
        </p>
      </div>
      
      <BlogList posts={allPosts} />
    </div>
  );
} 