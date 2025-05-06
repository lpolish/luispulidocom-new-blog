'use client';

import type { Post } from '@/lib/posts';
import { InfiniteScrollPosts } from './InfiniteScrollPosts';

interface PostsSectionProps {
  initialPosts: Post[];
  allPosts: Post[];
}

export function PostsSection({ initialPosts, allPosts }: PostsSectionProps) {
  return <InfiniteScrollPosts initialPosts={initialPosts} allPosts={allPosts} />;
} 