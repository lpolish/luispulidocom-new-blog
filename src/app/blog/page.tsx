import Link from 'next/link';
import { getSortedPostsData, type Post } from '@/lib/posts';
import { BlogList } from '@/components/BlogList';
import SubscribeForm from '@/components/SubscribeForm';
import ReCAPTCHA from '@/components/ReCAPTCHA';

export const metadata = {
  title: 'Blog | Luis Pulido',
  description: 'Articles on networking, AI, science, and technical topics',
};

export default async function Blog() {
  const allPosts = await getSortedPostsData();
  
  return (
    <div className="max-w-5xl mx-auto pt-14">
      <div className="mb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-text">
          Blog
        </h1>
        <p className="text-textMuted">
          Insights on technology, architecture, and systems design.
        </p>
      </div>
      
      <div className="px-4">
        <BlogList posts={allPosts} />
      </div>

      <div className="mt-12 mb-8 px-4">
        <div className="bg-primary/30 backdrop-blur-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold mb-3 text-text">Stay Updated</h2>
          <p className="text-textMuted mb-4 text-sm">
            Subscribe to receive updates when new content is published.
          </p>
          <SubscribeForm />
        </div>
      </div>

      <ReCAPTCHA />
    </div>
  );
} 