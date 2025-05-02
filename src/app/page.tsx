import { getFeaturedPosts } from '@/lib/posts';
import { FeaturedPosts } from '@/components/FeaturedPosts';

export default function Home() {
  const featuredPosts = getFeaturedPosts();
  
  return (
    <div className="space-y-24 mb-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">
          Technical Insights & Knowledge Sharing
        </h1>
        <p className="text-xl text-textMuted mb-8">
          Exploring the intersection of technology, networking, and artificial intelligence through code and documentation.
        </p>
      </div>
      <FeaturedPosts posts={featuredPosts} />
    </div>
  );
}
