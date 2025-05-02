'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Post } from '@/lib/posts';

interface BlogPostProps {
  post: Post;
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-12">
          <Link 
            href="/blog" 
            className="text-accent hover:text-accent/80 inline-flex items-center mb-6 group"
          >
            <svg 
              className="w-4 h-4 mr-1 transform transition-transform duration-300 group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all posts
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">
            {post.title}
          </h1>
          <p className="text-textMuted font-mono">{post.date}</p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
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
        </header>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent2 prose-code:bg-primary/50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-pre:bg-primary/50 prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4 prose-blockquote:border-l-accent prose-blockquote:pl-4 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 border-t border-border pt-8"
      >
        <Link 
          href="/blog" 
          className="text-accent hover:text-accent/80 inline-flex items-center group"
        >
          <svg 
            className="w-4 h-4 mr-1 transform transition-transform duration-300 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all posts
        </Link>
      </motion.div>
    </div>
  );
} 