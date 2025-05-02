# Luis Pulido Blog

A minimalistic, dark-mode blog focused on technical topics like networking, AI, and science.

## Overview

This is a personal blog built with Next.js and TypeScript, designed to be:
- Minimalistic and distraction-free
- Easy to maintain
- Fast-loading and SEO-friendly
- Dark-mode only with an ultradark color palette

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter and remark
- **Type Safety**: TypeScript
- **Deployment**: Static export (hostable on Netlify, Vercel, GitHub Pages, etc.)

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lpolish/luispulido.com.git
   cd luispulido.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Content

### Creating Blog Posts

1. Create a new Markdown file in `src/content/posts/` with a filename that will become the URL slug.
2. Add the following frontmatter at the top of the file:

   ```markdown
   ---
   title: "Your Post Title"
   date: "YYYY-MM-DD"
   excerpt: "A brief description of your post"
   tags: ["tag1", "tag2"]
   isFeatured: true  # Optional, set to true to feature on homepage
   ---

   # Your Post Title

   Your content goes here...
   ```

3. Write your post content using Markdown syntax below the frontmatter.

### Customizing Pages

- **Homepage**: Edit `src/app/page.tsx`
- **About**: Edit `src/app/about/page.tsx`
- **Contact**: Edit `src/app/contact/page.tsx`

## Building and Deployment

### Build for Production

```bash
npm run build
```

This will generate static HTML files in the `out` directory.

### Deploying to Netlify/Vercel/GitHub Pages

- **Netlify**: Connect your repository and use the build command `npm run build` with publish directory `out`.
- **Vercel**: Connect your repository and Vercel will automatically detect Next.js settings.
- **GitHub Pages**: Push the `out` directory to the `gh-pages` branch.

## Site Structure

```
├── src/
│   ├── app/                # Pages and routes
│   │   ├── blog/           # Blog listing and post pages
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable components
│   ├── content/            # Content files
│   │   └── posts/          # Blog posts in Markdown
│   └── lib/                # Utility functions
│       └── posts.ts        # Blog post handling
├── public/                 # Static assets
└── tailwind.config.js      # Tailwind configuration
```

## Maintenance Tips

- **Adding Images**: Place images in the `public/images` directory and reference them as `/images/filename.jpg`.
- **Updating Styling**: Modify the theme in `tailwind.config.js` or adjust component styles in their respective files.
- **SEO**: Update metadata in each page's component to improve search engine visibility.

## Image Hosting Alternatives

- **Local Images**: Store images in the `public/images` directory (simplest approach)
- **Free Alternatives to Cloudinary**:
  - Imgix has a free tier
  - Imgur for simple image hosting
  - GitHub repository itself for version-controlled images

## License

This project is MIT licensed.

---

Built with ❤️ using Next.js
