/**
 * Custom rehype plugin to store the original unprocessed code as a data attribute
 * This ensures we can copy the raw code text reliably
 */
export function rehypeStoreCodeContent() {
  return (tree: any) => {
    visitElements(tree);
    return tree;
  };
}

/**
 * Recursively visit all elements in the tree
 */
function visitElements(node: any) {
  // Process node if it's a pre element with code child
  if (
    node.type === 'element' &&
    node.tagName === 'pre' && 
    node.children && 
    node.children.length > 0 && 
    node.children[0].type === 'element' &&
    node.children[0].tagName === 'code'
  ) {
    const codeNode = node.children[0];
    
    // Extract the text content from the code node
    const codeContent = extractTextContent(codeNode);
    
    // Store the original code as a data attribute on the pre element
    if (!node.properties) {
      node.properties = {};
    }
    
    // Set a data attribute with the raw code content
    node.properties['data-raw-code'] = codeContent;
    
    // Also store it on the code element for redundancy
    if (!codeNode.properties) {
      codeNode.properties = {};
    }
    codeNode.properties['data-raw-code'] = codeContent;
    
    // Log for debugging
    console.log('Stored code content:', codeContent.substring(0, 50) + '...');
  }
  
  // Visit children
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      visitElements(child);
    }
  }
}

/**
 * Extract text content from a node and its children
 * This improved version handles more edge cases
 */
function extractTextContent(node: any): string {
  // Text node - direct value
  if (node.type === 'text' && typeof node.value === 'string') {
    return node.value;
  }
  
  // If node has a value property directly
  if (typeof node.value === 'string') {
    return node.value;
  }
  
  // If there's literal content in the properties
  if (node.properties && typeof node.properties.textContent === 'string') {
    return node.properties.textContent;
  }
  
  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    return node.children.map((child: any) => extractTextContent(child)).join('');
  }
  
  return '';
} 