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

      <div className="mt-16 mb-8">
        <div className="bg-primary/50 backdrop-blur-sm rounded-xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-4 text-text">Stay Updated</h2>
          <p className="text-textMuted mb-6">
            Subscribe to my newsletter to receive updates when new content is published.
          </p>
          <SubscribeForm />
        </div>
      </div>

      <ReCAPTCHA />
    </div>
  );
} 