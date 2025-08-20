'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { Post } from '@/lib/posts';
import { useReferences } from '@/contexts/ReferenceContext';
import { ReferencePopover } from './ReferencePopover';

interface BlogPostProps {
  post: Post;
}

export function BlogPost({ post }: BlogPostProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { 
    setReferences, 
    activeReference, 
    activeElement, 
    isReferenceVisible, 
    showReference, 
    hideReference 
  } = useReferences();

  // Set up references when component mounts
  useEffect(() => {
    if (post.references) {
      // Convert to the format expected by the context
      const referenceMap = new Map();
      post.references.forEach((data, number) => {
        referenceMap.set(number, {
          id: number,
          number,
          title: data.title || `Reference ${number}`,
          url: data.url
        });
      });
      setReferences(referenceMap);
    }
  }, [post.references, setReferences]);

  // Set up event listeners for reference links
  useEffect(() => {
    const handleReferenceInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the target or any parent element is a reference link
      const referenceLink = target.closest('.reference-link') as HTMLElement;
      
      if (referenceLink) {
        const referenceId = referenceLink.getAttribute('data-reference-id');
        if (referenceId) {
          if (event.type === 'click') {
            event.preventDefault();
            showReference(referenceId, referenceLink);
          } else if (event.type === 'mouseenter') {
            showReference(referenceId, referenceLink);
          }
        }
      }
    };

    const handleMouseLeave = (event: Event) => {
      const target = event.target as HTMLElement;
      const referenceLink = target.closest('.reference-link');
      
      if (referenceLink) {
        // Add a small delay to allow moving to popover
        setTimeout(() => {
          const popover = document.querySelector('[role="dialog"]');
          if (!popover || !popover.matches(':hover')) {
            hideReference();
          }
        }, 150);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      // Use delegation for better performance and reliability
      contentElement.addEventListener('click', handleReferenceInteraction);
      contentElement.addEventListener('mouseenter', handleReferenceInteraction, { capture: true });
      contentElement.addEventListener('mouseleave', handleMouseLeave, { capture: true });

      return () => {
        contentElement.removeEventListener('click', handleReferenceInteraction);
        contentElement.removeEventListener('mouseenter', handleReferenceInteraction, { capture: true });
        contentElement.removeEventListener('mouseleave', handleMouseLeave, { capture: true });
      };
    }
  }, [showReference, hideReference]);

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
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent2 prose-code:bg-primary/50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-accent prose-blockquote:pl-4 prose-blockquote:italic"
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

      {/* Reference Popover */}
      {activeReference && (
        <ReferencePopover
          reference={activeReference}
          isOpen={isReferenceVisible}
          onClose={hideReference}
          triggerElement={activeElement}
        />
      )}
    </div>
  );
} 