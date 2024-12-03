import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { calculateNewNodePosition } from '../utils/nodeUtils';
import { FlowNode, Tag, SearchResult } from '../types';

interface MindMapState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  tags: Tag[];
  history: Array<{ nodes: Node[]; edges: Edge[] }>;
  historyIndex: number;
  searchResults: SearchResult[];
  searchQuery: string;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (parentId: string | null) => void;
  updateNodeContent: (nodeId: string, content: string) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string) => void;
  deselectAll: () => void;
  addTag: (nodeId: string, tag: Tag) => void;
  removeTag: (nodeId: string, tagId: string) => void;
  updateNodeNotes: (nodeId: string, notes: string) => void;
  undo: () => void;
  redo: () => void;
  search: (query: string) => void;
  navigateNodes: (direction: string) => void;
  deleteSelectedNode: () => void;
}

export const useMindMapStore = create<MindMapState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      tags: [],
      history: [],
      historyIndex: -1,
      searchResults: [],
      searchQuery: '',

      setNodes: (nodes) => {
        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ nodes: [...nodes], edges: get().edges });
        
        set({
          nodes,
          history: newHistory,
          historyIndex: historyIndex + 1,
        });
      },

      setEdges: (edges) => {
        const { history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ nodes: get().nodes, edges: [...edges] });
        
        set({
          edges,
          history: newHistory,
          historyIndex: historyIndex + 1,
        });
      },

      addNode: (parentId) => {
        const { nodes, edges } = get();
        const newNodeId = uuidv4();
        const parentNode = parentId ? nodes.find((n) => n.id === parentId) : null;
        const position = calculateNewNodePosition(parentNode, nodes);

        const newNode: FlowNode = {
          id: newNodeId,
          type: 'mindNode',
          position,
          data: {
            content: 'New Node',
            tags: [],
          },
        };

        const newEdge = parentId
          ? {
              id: `e${parentId}-${newNodeId}`,
              source: parentId,
              target: newNodeId,
            }
          : null;

        set((state) => ({
          nodes: [...state.nodes, newNode],
          edges: newEdge ? [...state.edges, newEdge] : state.edges,
          selectedNodeId: newNodeId,
        }));
      },

      updateNodeContent: (nodeId, content) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId ? { ...node, data: { ...node.data, content } } : node
          ),
        }));
      },

      deleteNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== nodeId),
          edges: state.edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
          selectedNodeId: null,
        }));
      },

      selectNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isSelected: node.id === nodeId,
            },
          })),
          selectedNodeId: nodeId,
        }));
      },

      deselectAll: () => {
        set((state) => ({
          nodes: state.nodes.map((node) => ({
            ...node,
            data: { ...node.data, isSelected: false },
          })),
          selectedNodeId: null,
        }));
      },

      addTag: (nodeId, tag) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    tags: [...(node.data.tags || []), tag],
                  },
                }
              : node
          ),
        }));
      },

      removeTag: (nodeId, tagId) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    tags: (node.data.tags || []).filter((t) => t.id !== tagId),
                  },
                }
              : node
          ),
        }));
      },

      updateNodeNotes: (nodeId, notes) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, notes } }
              : node
          ),
        }));
      },

      undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex > 0) {
          const previousState = history[historyIndex - 1];
          set({
            nodes: previousState.nodes,
            edges: previousState.edges,
            historyIndex: historyIndex - 1,
          });
        }
      },

      redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          set({
            nodes: nextState.nodes,
            edges: nextState.edges,
            historyIndex: historyIndex + 1,
          });
        }
      },

      search: (query) => {
        const { nodes } = get();
        const results: SearchResult[] = [];

        nodes.forEach((node) => {
          const content = node.data.content.toLowerCase();
          const notes = (node.data.notes || '').toLowerCase();
          const queryLower = query.toLowerCase();

          if (content.includes(queryLower)) {
            results.push({
              nodeId: node.id,
              matchType: 'content',
              matchText: node.data.content,
            });
          }

          if (notes.includes(queryLower)) {
            results.push({
              nodeId: node.id,
              matchType: 'notes',
              matchText: node.data.notes || '',
            });
          }

          node.data.tags?.forEach((tag) => {
            if (tag.name.toLowerCase().includes(queryLower)) {
              results.push({
                nodeId: node.id,
                matchType: 'tags',
                matchText: tag.name,
              });
            }
          });
        });

        set({ searchResults: results, searchQuery: query });
      },

      navigateNodes: (direction) => {
        const { nodes, selectedNodeId } = get();
        if (!selectedNodeId) return;

        const currentNode = nodes.find((n) => n.id === selectedNodeId);
        if (!currentNode) return;

        const { x, y } = currentNode.position;
        let nextNode;

        switch (direction) {
          case 'ArrowUp':
            nextNode = nodes
              .filter((n) => n.position.y < y)
              .sort((a, b) => b.position.y - a.position.y)[0];
            break;
          case 'ArrowDown':
            nextNode = nodes
              .filter((n) => n.position.y > y)
              .sort((a, b) => a.position.y - b.position.y)[0];
            break;
          case 'ArrowLeft':
            nextNode = nodes
              .filter((n) => n.position.x < x)
              .sort((a, b) => b.position.x - a.position.x)[0];
            break;
          case 'ArrowRight':
            nextNode = nodes
              .filter((n) => n.position.x > x)
              .sort((a, b) => a.position.x - b.position.x)[0];
            break;
        }

        if (nextNode) {
          get().selectNode(nextNode.id);
        }
      },

      deleteSelectedNode: () => {
        const { selectedNodeId } = get();
        if (selectedNodeId) {
          get().deleteNode(selectedNodeId);
        }
      },
    }),
    {
      name: 'mind-map-storage',
    }
  )
);