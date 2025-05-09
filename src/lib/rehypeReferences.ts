import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

/**
 * Custom rehype plugin to convert reference links like [1] into proper HTML links
 * that point to external URLs from the Inline References section, but leaves existing markdown links untouched.
 * Also ensures all external links open in a new tab with rel="noopener noreferrer".
 */
export function rehypeReferences() {
  return (tree: Node) => {
    // First pass: Collect reference URLs from the Inline References section
    const referenceUrls = new Map<string, string>();
    let inInlineReferences = false;
    
    visit(tree, 'element', (node: any) => {
      // Check if we're entering the Inline References section
      if (node.tagName === 'h3' && node.children?.[0]?.value === 'Inline References') {
        inInlineReferences = true;
        return;
      }
      
      // Check if we're leaving the Inline References section
      if (inInlineReferences && node.tagName === 'h3') {
        inInlineReferences = false;
        return;
      }
      
      // Only process list items within the Inline References section
      if (inInlineReferences && node.tagName === 'li') {
        // Extract the reference number
        const numberMatch = node.children?.[0]?.children?.[0]?.value?.match(/^\d+/);
        if (numberMatch) {
          const number = numberMatch[0];
          // Find the URL in the reference text
          const linkNode = node.children?.find((child: any) => 
            child.type === 'element' && 
            child.tagName === 'a'
          );
          if (linkNode?.properties?.href) {
            referenceUrls.set(number, linkNode.properties.href);
          }
        }
      }
    });

    // Second pass: Convert plain reference links in text, but skip if already inside a link
    visit(tree, 'text', (node: any, index: number | undefined, parent: any) => {
      if (index === undefined || !parent || parent.type === 'element' && parent.tagName === 'a') return;
      // Match reference patterns like [1], [2], etc.
      const referenceRegex = /\[(\d+)\]/g;
      let match;
      let lastIndex = 0;
      const parts: any[] = [];
      while ((match = referenceRegex.exec(node.value)) !== null) {
        // Add text before the reference
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index)
          });
        }
        const referenceNumber = match[1];
        const url = referenceUrls.get(referenceNumber);
        // Create the reference link
        parts.push({
          type: 'element',
          tagName: 'a',
          properties: {
            href: url || `#reference-${referenceNumber}`,
            className: ['reference-link'],
            title: `Reference ${referenceNumber}`,
            target: url ? '_blank' : undefined,
            rel: url ? 'noopener noreferrer' : undefined
          },
          children: [{
            type: 'text',
            value: match[0]
          }]
        });
        lastIndex = match.index + match[0].length;
      }
      // Add remaining text
      if (lastIndex < node.value.length) {
        parts.push({
          type: 'text',
          value: node.value.slice(lastIndex)
        });
      }
      // Replace the original node with the parts if we found any references
      if (parts.length > 0) {
        parent.children.splice(index, 1, ...parts);
      }
    });

    // Final pass: Ensure all external links open in a new tab
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const href = node.properties.href;
        if (href.startsWith('http://') || href.startsWith('https://')) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }
    });

    return tree;
  };
} 