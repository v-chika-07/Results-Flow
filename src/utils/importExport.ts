import { Node, Edge } from 'reactflow';
import { MindNode } from '../types';

export const exportToMarkdown = (nodes: Node[], edges: Edge[]): string => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const edgeMap = new Map<string, string[]>();
  
  edges.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source)?.push(edge.target);
  });

  const processNode = (nodeId: string, level: number = 0): string => {
    const node = nodeMap.get(nodeId);
    if (!node) return '';

    const indent = '  '.repeat(level);
    let markdown = `${indent}- ${node.data.content}\n`;

    // Add tags if present
    if (node.data.tags?.length) {
      markdown += `${indent}  Tags: ${node.data.tags.map(t => `#${t.name}`).join(', ')}\n`;
    }

    // Add notes if present
    if (node.data.notes) {
      markdown += `${indent}  Notes: ${node.data.notes}\n`;
    }

    // Process children
    const children = edgeMap.get(nodeId) || [];
    children.forEach(childId => {
      markdown += processNode(childId, level + 1);
    });

    return markdown;
  };

  // Find root nodes (nodes with no incoming edges)
  const rootNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );

  return rootNodes.map(node => processNode(node.id)).join('\n');
};

export const importFromMarkdown = (markdown: string): { nodes: Node[], edges: Edge[] } => {
  const lines = markdown.split('\n').filter(line => line.trim());
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let lastNodeAtLevel: { [key: number]: string } = {};

  lines.forEach((line, index) => {
    const level = (line.match(/^\s*/)?.[0].length || 0) / 2;
    const content = line.trim().replace(/^-\s*/, '');
    
    // Skip tag and note lines
    if (content.startsWith('Tags:') || content.startsWith('Notes:')) {
      return;
    }

    const nodeId = `node-${index}`;
    const node: Node = {
      id: nodeId,
      type: 'mindNode',
      position: { x: level * 250, y: index * 100 },
      data: { content, tags: [], notes: '' },
    };

    // Connect to parent if exists
    if (level > 0 && lastNodeAtLevel[level - 1]) {
      edges.push({
        id: `e${lastNodeAtLevel[level - 1]}-${nodeId}`,
        source: lastNodeAtLevel[level - 1],
        target: nodeId,
      });
    }

    lastNodeAtLevel[level] = nodeId;
    nodes.push(node);
  });

  return { nodes, edges };
};