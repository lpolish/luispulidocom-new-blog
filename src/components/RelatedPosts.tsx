import Link from 'next/link';
import { Post } from '@/lib/posts';

interface RelatedPostsProps {
  currentPost: Post;
  allPosts: Post[];
}

export function RelatedPosts({ currentPost, allPosts }: RelatedPostsProps) {
  // Filter out the current post and find posts with matching tags
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .filter(post => {
      const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      return commonTags.length > 0;
    })
    .slice(0, 3); // Show at most 3 related posts

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-6 rounded-lg border border-border hover:border-primary transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
            <p className="text-textMuted text-sm">{post.date}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-backgroundMuted text-textMuted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 