// Utility function for conditional classNames
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

// Get the correct site URL for auth redirects
export function getSiteUrl(): string {
  // Always prioritize SITE_URL if available (for both dev and prod)
  if (process.env.SITE_URL) {
    return process.env.SITE_URL
  }

  // Fallback for development
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Final fallback for server-side rendering
  return 'http://localhost:3000'
}
