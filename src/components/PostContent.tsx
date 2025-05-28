'use client';

import { useEffect, useRef } from 'react';

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      processCodeBlocks();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  const processCodeBlocks = () => {
    if (!contentRef.current) return;
    
    console.log('Processing code blocks for copy buttons...');
    const codeBlocks = contentRef.current.querySelectorAll('pre code');
    console.log(`Found ${codeBlocks.length} code blocks`);
    
    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      if (!pre) {
        console.warn('Code block has no pre parent element', index);
        return;
      }

      // Skip if already has a copy button
      if (pre.parentElement?.querySelector('.copy-button') || pre.querySelector('.copy-button')) {
        console.log('Code block already has copy button', index);
        return;
      }

      // Set code element background to transparent to prevent nested background
      codeBlock.setAttribute('style', 'background: transparent !important; color: #ffffff;');
      
      // Get raw code - try multiple sources to ensure we get the content
      let rawCode = '';
      
      // Use the textContent directly from the code block (more reliable)
      rawCode = codeBlock.textContent || '';
      
      console.log(`Block ${index} - Code content length: ${rawCode.length}`);
      if (rawCode.length < 10) {
        console.warn('Warning: Short code content detected');
      }
      
      // Create a wrapper div
      const wrapper = document.createElement('div');
      wrapper.className = 'relative my-6';
      wrapper.style.position = 'relative';
      
      // Style the pre element
      pre.style.background = '#000000';
      pre.style.padding = '2rem 1rem 1rem 1rem';
      pre.style.borderRadius = '0.5rem';
      pre.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      pre.style.position = 'relative'; // Ensure position is set for absolute copy button
      
      // Create the copy button
      const button = document.createElement('button');
      button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-black/70 text-white rounded hover:bg-black/90 hover:text-white transition-colors duration-200 border border-white/20';
      button.textContent = 'Copy';
      button.setAttribute('type', 'button');
      button.setAttribute('aria-label', 'Copy to clipboard');
      
      // Set up the copy function
      button.addEventListener('click', async () => {
        try {
          const codeToUse = rawCode.trim();
          
          if (!codeToUse) {
            console.error('No code to copy', {
              blockIndex: index,
              textContentLength: rawCode.length || 0
            });
            button.textContent = 'Error';
            button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-red-900/80 text-red-300 rounded border border-red-700/40 transition-colors duration-200';
            
            setTimeout(() => {
              button.textContent = 'Copy';
              button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-black/70 text-white rounded hover:bg-black/90 hover:text-white transition-colors duration-200 border border-white/20';
            }, 2000);
            return;
          }
          
          // Copy the code
          console.log(`Copying code from block ${index}, length: ${codeToUse.length}`);
          await navigator.clipboard.writeText(codeToUse);
          
          // Update button to show success
          button.textContent = 'Copied';
          button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-green-900/80 text-green-300 rounded border border-green-700/40 transition-colors duration-200';
          
          // Reset button after delay
          setTimeout(() => {
            button.textContent = 'Copy';
            button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-black/70 text-white rounded hover:bg-black/90 hover:text-white transition-colors duration-200 border border-white/20';
          }, 2000);
        } catch (err) {
          console.error(`Failed to copy text from block ${index}:`, err);
          
          // Update button to show error
          button.textContent = 'Error';
          button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-red-900/80 text-red-300 rounded border border-red-700/40 transition-colors duration-200';
          
          // Reset button after delay
          setTimeout(() => {
            button.textContent = 'Copy';
            button.className = 'absolute right-4 top-4 z-30 px-2 py-1 text-xs bg-black/70 text-white rounded hover:bg-black/90 hover:text-white transition-colors duration-200 border border-white/20';
          }, 2000);
        }
      });
      
      // Add the button to the pre element
      pre.appendChild(button);
      
      // Only wrap if pre isn't already wrapped (more reliable approach)
      if (!pre.parentElement?.classList.contains('relative')) {
        // Add all elements to the DOM
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }
    });
  };

  return (
    <div 
      ref={contentRef}
      className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:text-accent2 prose-code:bg-black prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-pre:bg-black prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-accent prose-blockquote:pl-4 prose-blockquote:italic [&_.reference-link]:text-accent [&_.reference-link]:no-underline [&_.reference-link]:hover:underline [&_.reference-link]:font-medium [&_.reference-link]:transition-colors [&_.reference-link]:duration-200"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
} 