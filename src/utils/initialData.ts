import { Node, Edge } from 'reactflow';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'mindNode',
    position: { x: 0, y: 0 },
    data: { content: 'Main Topic' },
  },
  {
    id: '2',
    type: 'mindNode',
    position: { x: -100, y: 100 },
    data: { content: 'Subtopic 1' },
  },
  {
    id: '3',
    type: 'mindNode',
    position: { x: 100, y: 100 },
    data: { content: 'Subtopic 2' },
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];