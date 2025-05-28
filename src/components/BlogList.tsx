'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Post } from '@/lib/posts';

interface BlogListProps {
  posts: Post[];
}

export function BlogList({ posts }: BlogListProps) {
  // Helper function to determine featured posts (every 5th post)
  const isFeatured = (index: number): boolean => {
    return index % 5 === 0;
  };

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-4"
      >
        <p className="text-textMuted">No posts found. Check back soon!</p>
      </motion.div>
    );
  }

  return (
    <div className="masonry-layout">
      {posts.map((post: Post, index: number) => {
        // Determine if this is a featured/wide post
        const featured = isFeatured(index);
        
        return (
          <motion.article 
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className={`card-item ${featured ? 'md:col-span-2' : ''}`}
          >
            <div className="bg-primary/20 backdrop-blur-sm rounded-lg overflow-hidden border border-border/60 p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 h-full flex flex-col">
              <p className="text-xs text-accent mb-2 font-mono opacity-80">{post.date}</p>
              
              <h2 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold mb-3 flex-none tracking-tight`}>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-text hover:text-accent transition-colors duration-300 group"
                >
                  {post.title}
                  <span className="block w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full mt-0.5"></span>
                </Link>
              </h2>
              
              <p className="text-textMuted text-sm mb-5 flex-grow leading-relaxed">
                {post.excerpt ? (post.excerpt.length > 160 && !featured 
                  ? post.excerpt.substring(0, 160) + '...' 
                  : post.excerpt) : 'No excerpt available.'}
              </p>
              
              <div className="flex justify-between items-center flex-none mt-auto pt-3 border-t border-border/30">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, featured ? 3 : 2).map((tag: string) => (
                      <span 
                        key={tag} 
                        className="bg-secondary/20 text-textMuted text-xs px-2 py-0.5 rounded-full border border-border/50 hover:border-accent/30 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > (featured ? 3 : 2) && (
                      <span className="text-textMuted text-xs px-1 opacity-70">+{post.tags.length - (featured ? 3 : 2)}</span>
                    )}
                  </div>
                )}
                
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-accent hover:text-accent/80 inline-flex items-center group text-sm"
                >
                  Read article
                  <svg 
                    className="w-3 h-3 ml-1.5 transform transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
} 