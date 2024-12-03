import React from 'react';
import { Search, X } from 'lucide-react';
import { useMindMapStore } from '../store/mindMapStore';

export const SearchPanel = () => {
  const { search, searchResults, searchQuery, selectNode } = useMindMapStore();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSearch = (query: string) => {
    search(query);
  };

  const handleResultClick = (nodeId: string) => {
    selectNode(nodeId);
    setIsOpen(false);
  };

  return (
    <div className="fixed left-4 top-20 w-64">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent border-none focus:outline-none dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={`${result.nodeId}-${index}`}
                onClick={() => handleResultClick(result.nodeId)}
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mb-2 last:mb-0"
              >
                <div className="text-sm font-medium dark:text-white">{result.matchText}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.matchType === 'content' ? 'Content' : result.matchType === 'notes' ? 'Notes' : 'Tag'}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};