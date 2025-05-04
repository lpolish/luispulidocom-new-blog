'use client';

import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const ultraDarkStyle = {
  'pre[class*="language-"]': {
    background: '#000000',
    color: '#ffffff',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    fontSize: '0.95em',
    lineHeight: '1.6',
    margin: 0,
  },
  'code[class*="language-"]': {
    background: 'transparent',
    color: '#ffffff',
    fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
  },
  '.token.comment': { color: '#6a6a6a' },
  '.token.keyword': { color: '#8CA0B6' },
  '.token.string': { color: '#A3A380' },
  '.token.function': { color: '#50fa7b' },
  '.token.number': { color: '#f1fa8c' },
  '.token.operator': { color: '#F4F4F9' },
  '.token.punctuation': { color: '#F4F4F9' },
};

interface CodeBlockProps {
  language: string;
  code: string | null | undefined;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [actualCode, setActualCode] = useState('');
  
  // Process and store the code on mount and when code changes
  useEffect(() => {
    // Ensure we have a valid string and trim it
    const rawCode = typeof code === 'string' ? code.trim() : '';
    setActualCode(rawCode);
    
    // Debug log to check if code is being properly set
    if (rawCode) {
      console.log('Code set in CodeBlock, length:', rawCode.length);
    } else {
      console.warn('Empty code in CodeBlock component');
    }
  }, [code]);
  
  // Simple, direct copy function that uses the state value
  const copyToClipboard = async () => {
    if (!actualCode) {
      console.error('No code available to copy');
      return;
    }
    
    try {
      console.log('Copying to clipboard, length:', actualCode.length);
      await navigator.clipboard.writeText(actualCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  return (
    <div className="relative my-6 rounded-lg overflow-hidden bg-black">
      <button
        onClick={copyToClipboard}
        className={`absolute right-4 top-4 z-30 px-2 py-1 text-xs ${
          copied 
            ? "bg-green-900/80 text-green-300 border-green-700/40" 
            : "bg-black/70 text-white hover:bg-black/90 hover:text-white border-white/20"
        } rounded border transition-colors duration-200`}
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        type="button"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      
      <SyntaxHighlighter
        language={language || 'text'}
        style={ultraDarkStyle}
        showLineNumbers
        customStyle={{ 
          background: '#000000', 
          color: '#ffffff', 
          margin: 0, 
          borderRadius: '0.5rem',
          padding: '2rem 1rem 1rem 1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        codeTagProps={{ 
          style: { 
            color: '#ffffff', 
            fontFamily: 'Fira Mono, monospace',
            background: 'transparent'
          }
        }}
      >
        {actualCode}
      </SyntaxHighlighter>
    </div>
  );
} 