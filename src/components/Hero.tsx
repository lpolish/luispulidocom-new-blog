'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-accent/5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-text to-textMuted bg-clip-text text-transparent">
            Building robust systems and sharing knowledge through code
          </h1>
          <p className="text-xl text-textMuted mb-8">
            I'm a software engineer focused on creating scalable solutions and documenting technical insights.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/blog" 
              className="bg-accent text-background px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors duration-300"
            >
              Read my articles
            </Link>
            <Link 
              href="/projects" 
              className="border border-border px-6 py-3 rounded-lg font-medium hover:border-accent/50 transition-colors duration-300"
            >
              View my projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 