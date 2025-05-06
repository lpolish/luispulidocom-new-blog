import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllPostSlugs, getPostData, getSortedPostsData, type Post } from '@/lib/posts';
import { RelatedPosts } from '@/components/RelatedPosts';
import { notFound } from 'next/navigation';
import { PostContent } from '@/components/PostContent';

export async function generateStaticParams() {
  const paths = await getAllPostSlugs();
  return paths.map((path) => path.params);
}

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props) {
  try {
    const post = await getPostData(params.slug);
    return {
      title: `${post.title} | Luis Pulido`,
      description: post.excerpt,
    };
  } catch (error) {
    return {
      title: 'Post Not Found | Luis Pulido',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function Post({ params }: Props) {
  try {
    const post = await getPostData(params.slug);
    const allPosts = await getSortedPostsData();
    
    return (
      <div className="max-w-3xl mx-auto">
        <article>
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
          
          <PostContent content={post.content} />
        </article>
        
        <RelatedPosts currentPost={post} allPosts={allPosts} />
        
        <div className="mt-16 border-t border-border pt-8">
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
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 