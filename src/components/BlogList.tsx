'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Post } from '@/lib/posts';

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-primary/50 backdrop-blur-sm rounded-xl p-8 text-center border border-border"
      >
        <p className="text-textMuted">No posts found. Check back soon!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post: Post, index: number) => (
        <motion.article 
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-primary/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border p-8 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
        >
          <p className="text-sm text-accent mb-2 font-mono">{post.date}</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            <Link 
              href={`/blog/${post.slug}`} 
              className="text-text hover:text-accent transition-colors duration-300 group"
            >
              {post.title}
              <span className="block w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full mt-1"></span>
            </Link>
          </h2>
          <p className="text-textMuted mb-6 text-lg leading-relaxed">{post.excerpt}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-secondary/50 text-textMuted text-xs px-3 py-1 rounded-full border border-border hover:border-accent/30 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <Link 
            href={`/blog/${post.slug}`} 
            className="text-accent hover:text-accent/80 inline-flex items-center group"
          >
            Read full article
            <svg 
              className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.article>
      ))}
    </div>
  );
} 