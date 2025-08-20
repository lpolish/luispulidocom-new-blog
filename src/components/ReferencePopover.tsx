'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reference {
  id: string;
  title: string;
  url: string;
  number: string;
}

interface ReferencePopoverProps {
  reference: Reference;
  isOpen: boolean;
  onClose: () => void;
  triggerElement: HTMLElement | null;
}

export function ReferencePopover({ reference, isOpen, onClose, triggerElement }: ReferencePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!triggerElement || !popoverRef.current) return;

      const triggerRect = triggerElement.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      let top = triggerRect.bottom + 8;
      let left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2);

      // Adjust if popover would go off-screen horizontally
      if (left < 8) {
        left = 8;
      } else if (left + popoverRect.width > viewport.width - 8) {
        left = viewport.width - popoverRect.width - 8;
      }

      // Adjust if popover would go off-screen vertically
      if (top + popoverRect.height > viewport.height - 8) {
        top = triggerRect.top - popoverRect.height - 8;
      }

      setPosition({ top: top + window.scrollY, left });
    };

    if (isOpen && triggerElement) {
      // Initial positioning
      updatePosition();
      
      // Update position on scroll or resize
      const handleUpdate = () => updatePosition();
      window.addEventListener('scroll', handleUpdate);
      window.addEventListener('resize', handleUpdate);
      
      return () => {
        window.removeEventListener('scroll', handleUpdate);
        window.removeEventListener('resize', handleUpdate);
      };
    }
  }, [isOpen, triggerElement]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
          triggerElement && !triggerElement.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleMouseEnter = () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      closeTimeoutRef.current = setTimeout(() => {
        onClose();
      }, 300);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      
      const popover = popoverRef.current;
      if (popover) {
        popover.addEventListener('mouseenter', handleMouseEnter);
        popover.addEventListener('mouseleave', handleMouseLeave);
      }
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        
        if (popover) {
          popover.removeEventListener('mouseenter', handleMouseEnter);
          popover.removeEventListener('mouseleave', handleMouseLeave);
        }
        
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }
  }, [isOpen, onClose, triggerElement]);

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed z-50 bg-primary border border-border rounded-lg shadow-xl max-w-sm"
          style={{ top: position.top, left: position.left }}
          role="dialog"
          aria-labelledby={`reference-${reference.number}-title`}
          aria-describedby={`reference-${reference.number}-url`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                  [{reference.number}]
                </span>
                <span 
                  id={`reference-${reference.number}-title`}
                  className="text-sm font-medium text-text"
                >
                  Reference {reference.number}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-textMuted hover:text-text transition-colors duration-200 p-1"
                aria-label="Close reference"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {reference.title && (
              <h3 className="text-sm font-medium text-text mb-2 leading-tight">
                {reference.title}
              </h3>
            )}
            
            <div className="space-y-3">
              <div>
                <p 
                  id={`reference-${reference.number}-url`}
                  className="text-xs text-textMuted font-mono break-all"
                >
                  {getDomainFromUrl(reference.url)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors duration-200"
                >
                  <span>Visit source</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(reference.url);
                    // Could add a toast notification here
                  }}
                  className="inline-flex items-center gap-1 text-xs text-textMuted hover:text-text transition-colors duration-200"
                  title="Copy URL"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Arrow pointing to trigger element */}
          <div 
            className="absolute w-3 h-3 bg-primary border-l border-t border-border transform rotate-45"
            style={{
              top: '-6px',
              left: '50%',
              marginLeft: '-6px',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}