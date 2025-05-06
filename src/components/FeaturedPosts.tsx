'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Post } from '@/lib/posts';

interface FeaturedPostsProps {
  posts: Post[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-bold mb-2 hover:text-accent transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-textMuted mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-accent">{post.date}</span>
                  <span className="text-sm text-textMuted">Read more →</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
} 