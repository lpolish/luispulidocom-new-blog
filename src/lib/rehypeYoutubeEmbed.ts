import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

/**
 * rehype plugin to transform custom YouTube embed shortcodes in markdown into responsive iframes.
 * Usage in markdown: {{< youtube id="KndkxGyI9z8" title="Kamchatka Megaquake 2025" >}}
 */
export function rehypeYoutubeEmbed() {
  return (tree: Node) => {
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (!node.value) return;
      // Match shortcode: {{< youtube id="VIDEO_ID" title="TITLE" >}}
      const regex = /\{\{<\s*youtube\s+id="([^"]+)"(?:\s+title="([^"]+)")?\s*>\}\}/g;
      let match;
      let lastIndex = 0;
      const parts: any[] = [];
      while ((match = regex.exec(node.value)) !== null) {
        // Add text before the shortcode
        if (match.index > lastIndex) {
          parts.push({ type: 'text', value: node.value.slice(lastIndex, match.index) });
        }
        const videoId = match[1];
        const title = match[2] || 'YouTube Video';
        // Add the responsive iframe
        parts.push({
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;',
            className: ['youtube-embed'],
          },
          children: [
            {
              type: 'element',
              tagName: 'iframe',
              properties: {
                src: `https://www.youtube.com/embed/${videoId}`,
                title,
                frameborder: '0',
                allowfullscreen: true,
                style: 'position:absolute;top:0;left:0;width:100%;height:100%;',
              },
              children: [],
            },
          ],
        });
        lastIndex = match.index + match[0].length;
      }
      // Add remaining text
      if (lastIndex < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex) });
      }
      // Replace the node if we found any embeds
      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
      }
    });
    return tree;
  };
}
