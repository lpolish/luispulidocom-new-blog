export const dynamic = 'force-static';
import { getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { Suspense } from 'react';
import Loading from './loading';
import { PostsSection } from '@/components/PostsSection';
import { AuthRedirectHandler } from '@/components/AuthRedirectHandler';

export default async function Home() {
  const allPosts = await getSortedPostsData();
  const initialPosts = allPosts.slice(0, 10); // Show a balanced number of initial posts

  return (
    <div className="mb-20">
      <AuthRedirectHandler />
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h1 className="sr-only">Luis Pulido's Blog</h1>
        <PostsSection initialPosts={initialPosts} allPosts={allPosts} />
      </div>
    </div>
  );
}
