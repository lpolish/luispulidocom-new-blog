# Sitemap Generation Documentation

## Overview
The website automatically generates a comprehensive `sitemap.xml` file that follows the [Sitemaps XML format](https://www.sitemaps.org/protocol.html) for optimal SEO performance.

## Implementation Details

### Location
- **Sitemap URL**: `https://luispulido.com/sitemap.xml`
- **Implementation**: `/src/app/sitemap.xml/route.ts`

### Features
- ✅ **Automatic Generation**: Dynamically generated on each request
- ✅ **Complete Coverage**: Includes all public pages and blog posts
- ✅ **SEO Optimized**: Proper priorities, change frequencies, and modification dates
- ✅ **Error Handling**: Graceful error handling with fallback responses
- ✅ **Caching**: 1-hour cache control for performance
- ✅ **Robots Integration**: Referenced in `/robots.txt`

### Included Routes

#### Static Pages
| Route | Priority | Change Frequency | Description |
|-------|----------|------------------|-------------|
| `/` | 1.0 | daily | Homepage |
| `/blog` | 0.9 | daily | Blog listing |
| `/about` | 0.8 | monthly | About page |
| `/contact` | 0.7 | monthly | Contact page |
| `/chess` | 0.6 | monthly | Chess game page |
| `/random` | 0.5 | weekly | Random content page |
| `/privacy` | 0.3 | yearly | Privacy policy |
| `/terms-of-service` | 0.3 | yearly | Terms of service |

#### Dynamic Content
- **Blog Posts**: All posts from `/src/content/posts/` with their actual publication dates
- **Priority**: 0.7 for all blog posts
- **Change Frequency**: Monthly

### Technical Specifications
- **XML Format**: Compliant with sitemaps.org schema
- **Encoding**: UTF-8
- **Namespace**: `http://www.sitemaps.org/schemas/sitemap/0.9`
- **Content-Type**: `application/xml`
- **Cache Headers**: `public, max-age=3600, s-maxage=3600`

### Build Integration
The sitemap is automatically available during:
- **Development**: `pnpm dev` - Available at `http://localhost:3000/sitemap.xml`
- **Production**: Deployed and accessible at production URL
- **Build Time**: No additional build step required (generated on-demand)

### SEO Benefits
1. **Search Engine Discovery**: Helps search engines find all pages
2. **Indexing Priority**: Communicates page importance via priority values
3. **Update Frequency**: Indicates how often content changes
4. **Last Modified**: Provides accurate content freshness information
5. **Robots.txt Integration**: Automatically discoverable by crawlers

### Validation
The sitemap can be validated using:
- [Google Search Console](https://search.google.com/search-console)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

### Monitoring
- Check Google Search Console for sitemap processing status
- Monitor for any crawl errors or warnings
- Verify all important pages are included and indexed

### Future Enhancements
- Add image and video sitemaps if multimedia content is added
- Implement sitemap index if the site grows beyond 50,000 URLs
- Add alternate language versions if multilingual support is implemented