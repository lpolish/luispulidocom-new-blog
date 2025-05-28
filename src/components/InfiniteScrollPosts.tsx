'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '@/lib/posts';
import { BlogList } from './BlogList';

interface InfiniteScrollPostsProps {
  initialPosts: Post[];
  allPosts: Post[];
}

export function InfiniteScrollPosts({ initialPosts, allPosts }: InfiniteScrollPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(0); // Start from 0 since we already have initial posts
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 8; // Show more posts at once for a better masonry layout

  const loadMorePosts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;
    const startIndex = nextPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const newPosts = allPosts.slice(startIndex, endIndex);

    if (newPosts.length > 0) {
      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setPage(nextPage);
      setHasMore(endIndex < allPosts.length);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [loading, hasMore, page, allPosts, postsPerPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;

      // Load more posts when user is near the bottom (within 300px)
      if (scrollHeight - scrollTop - clientHeight < 300) {
        loadMorePosts();
      }
    };

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMorePosts]);

  // Check if we have more posts to load initially
  useEffect(() => {
    setHasMore(posts.length < allPosts.length);
  }, [posts.length, allPosts.length]);

  return (
    <div>
      <BlogList posts={posts} />
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent/70"></div>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-10 text-textMuted text-sm">
          <span className="border-t border-border/40 inline-block pt-2 px-4">No more posts</span>
        </div>
      )}
    </div>
  );
} 