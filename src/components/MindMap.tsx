import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindNode } from './MindNode';
import { useMindMapStore } from '../store/mindMapStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const nodeTypes = {
  mindNode: MindNode,
};

export const MindMap = () => {
  const { nodes, edges, setNodes, setEdges, addNode } = useMindMapStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  useKeyboardShortcuts();

  const onNodesChange = useCallback((changes: any) => {
    setNodes(changes);
  }, [setNodes]);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges(changes);
  }, [setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => [...eds, params as Edge]),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNode(null);
    },
    [reactFlowInstance, addNode]
  );

  const onDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!(event.target as HTMLElement).classList.contains('react-flow__pane')) return;
      
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds || !reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(null);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div 
      ref={reactFlowWrapper} 
      className="w-full h-full"
      onDoubleClick={onDoubleClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={setReactFlowInstance}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background 
          color="#94a3b8" 
          gap={16} 
          size={1} 
          className="dark:opacity-20"
        />
        <Controls className="bg-white dark:bg-gray-800 dark:text-white" />
        <MiniMap
          nodeColor="#475569"
          maskColor="rgb(241, 245, 249, 0.6)"
          className="bg-white dark:bg-gray-800"
        />
      </ReactFlow>
    </div>
  );
};