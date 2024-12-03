import React from 'react';
import { Plus, X } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';
import { Tag } from '../types';

const TAG_COLORS = [
  'bg-red-100 text-red-800',
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
];

export const TagPanel = () => {
  const { selectedNodeId, nodes, addTag, removeTag } = useMindMapStore();
  const [isOpen, setIsOpen] = React.useState(true);
  const [newTagName, setNewTagName] = React.useState('');

  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  const tags = selectedNode?.data.tags || [];

  const handleAddTag = () => {
    if (!selectedNodeId || !newTagName.trim()) return;

    const tag: Tag = {
      id: crypto.randomUUID(),
      name: newTagName.trim(),
      color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
    };

    addTag(selectedNodeId, tag);
    setNewTagName('');
  };

  if (!selectedNodeId) return null;

  return (
    <div className="fixed right-4 top-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold dark:text-white">Tags</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag..."
              className="flex-1 px-2 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleAddTag}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={`px-2 py-1 rounded-full text-sm flex items-center gap-1 ${tag.color}`}
              >
                {tag.name}
                <button
                  onClick={() => removeTag(selectedNodeId, tag.id)}
                  className="hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};