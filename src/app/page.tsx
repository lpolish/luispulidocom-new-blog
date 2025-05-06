import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { Suspense } from 'react';
import Loading from './loading';
import { PostsSection } from '@/components/PostsSection';

export default async function Home() {
  const allPosts = await getSortedPostsData();
  const initialPosts = allPosts.slice(0, 4); // Show only the 4 most recent posts initially
  
  return (
    <div className="space-y-32 mb-32">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-text">
              Unpacking Systems, Software, and Ideas
            </h1>
            <p className="text-2xl text-textMuted leading-relaxed">
              Discover a take on software, architecture, and the craft of technology.
            </p>
            <div className="flex gap-4">
              <Link 
                href="#posts" 
                className="px-6 py-3 border border-border rounded-lg font-medium hover:border-accent transition-colors"
              >
                Start Reading
              </Link>
              <Suspense fallback={<Loading />}>
                <Link 
                  href={`/blog/${allPosts[Math.floor(Math.random() * allPosts.length)].slug}`}
                  className="px-6 py-3 border border-border rounded-lg font-medium hover:border-accent transition-colors"
                >
                  Random Post
                </Link>
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section id="posts">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold">Recent Posts</h2>
          </div>
          <PostsSection initialPosts={initialPosts} allPosts={allPosts} />
        </div>
      </section>
    </div>
  );
}
