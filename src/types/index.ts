export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface MindNode {
  id: string;
  content: string;
  tags: Tag[];
  notes?: string;
  children?: MindNode[];
}

export interface FlowNode {
  id: string;
  type: 'mindNode';
  position: { x: number; y: number };
  data: {
    content: string;
    tags: Tag[];
    notes?: string;
    isSelected?: boolean;
    isHighlighted?: boolean;
  };
}

export interface ThemeConfig {
  isDark: boolean;
  highContrast: boolean;
}

export type SearchResult = {
  nodeId: string;
  matchType: 'content' | 'notes' | 'tags';
  matchText: string;
};