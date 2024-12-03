import React from 'react';
import { Plus, Download, Upload, FileText, Sun, Moon } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';
import { useTheme } from '../hooks/useTheme';
import { exportToMarkdown, importFromMarkdown } from '../utils/importExport';

export const Toolbar = () => {
  const { addNode, nodes, edges, setNodes, setEdges } = useMindMapStore();
  const { isDark, toggleTheme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const markdown = exportToMarkdown(nodes, edges);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const { nodes: newNodes, edges: newEdges } = importFromMarkdown(content);
      setNodes(newNodes);
      setEdges(newEdges);
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50">
      <div className="flex flex-col gap-2">
        <button 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200" 
          title="New Node"
          onClick={() => addNode(null)}
        >
          <Plus className="w-5 h-5" />
        </button>
        
        <label 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200 cursor-pointer" 
          title="Import"
        >
          <Upload className="w-5 h-5" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            className="hidden"
            onChange={handleImport}
          />
        </label>
        
        <button 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200" 
          title="Export"
          onClick={handleExport}
        >
          <Download className="w-5 h-5" />
        </button>

        <button 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200" 
          title="Toggle Theme"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};