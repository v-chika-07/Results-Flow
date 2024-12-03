import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Edit2, Trash2, MessageSquare } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';
import { EditNodeDialog } from './EditNodeDialog';
import { NotesDialog } from './NotesDialog';
import { cn } from '../utils/cn';

export const MindNode = memo(({ data, isConnectable, id }: NodeProps) => {
  const { deleteNode, selectNode } = useMindMapStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(id);
  };

  return (
    <>
      <div
        className={cn(
          "px-4 py-2 shadow-lg rounded-md border-2 min-w-[150px]",
          "transition-all duration-200",
          "bg-white dark:bg-gray-800",
          "border-gray-200 dark:border-gray-700",
          data.isSelected && "ring-2 ring-blue-500",
          data.isHighlighted && "bg-blue-50 dark:bg-blue-900"
        )}
        onClick={handleNodeClick}
      >
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-slate-500 dark:!bg-slate-400"
        />
        
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {data.content}
          </p>
          <div className="flex items-center gap-1">
            <button
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => setIsEditingNotes(true)}
              title="Edit Notes"
            >
              <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => setIsEditing(true)}
              title="Edit Content"
            >
              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              onClick={() => deleteNode(id)}
              title="Delete Node"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {data.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.tags.map((tag) => (
              <span
                key={tag.id}
                className={`px-2 py-0.5 rounded-full text-xs ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          className="!bg-slate-500 dark:!bg-slate-400"
        />
      </div>

      <EditNodeDialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(content) => {
          useMindMapStore.getState().updateNodeContent(id, content);
        }}
        initialContent={data.content}
      />

      <NotesDialog
        isOpen={isEditingNotes}
        onClose={() => setIsEditingNotes(false)}
        onSave={(notes) => {
          useMindMapStore.getState().updateNodeNotes(id, notes);
        }}
        initialNotes={data.notes || ''}
      />
    </>
  );
});