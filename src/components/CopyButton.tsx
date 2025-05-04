'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CopyButton({ text, className = '', size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Size class mapping
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  // State-based classes
  const stateClasses = copied 
    ? "bg-green-900/80 text-green-300 border-green-700/40" 
    : isError
      ? "bg-red-900/80 text-red-300 border-red-700/40"
      : "bg-black/70 text-white hover:bg-black/90 hover:text-white border-white/20";

  const copy = async () => {
    if (!text || text.trim() === '') {
      console.error('No text to copy', { textLength: text?.length || 0 });
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }
    
    try {
      console.log('Copying content, length:', text.length);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`absolute right-4 top-4 z-30 ${sizeClasses[size]} ${stateClasses} rounded border transition-colors duration-200 ${className}`}
      aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      disabled={copied || isError}
      data-code-length={text?.length || 0}
    >
      {copied ? "Copied" : isError ? "Error" : "Copy"}
    </button>
  );
} 