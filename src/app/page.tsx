import { getFeaturedPosts } from '@/lib/posts';
import { Hero } from '@/components/Hero';
import { FeaturedPosts } from '@/components/FeaturedPosts';
import { Skills } from '@/components/Skills';

export default function Home() {
  const featuredPosts = getFeaturedPosts();
  
  return (
    <div className="space-y-24">
      <Hero />
      <FeaturedPosts posts={featuredPosts} />
      <Skills />
    </div>
  );
}
