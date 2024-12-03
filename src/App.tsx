import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { MindMap } from './components/MindMap';
import { Toolbar } from './components/Toolbar';
import { TagPanel } from './components/TagPanel';
import { SearchPanel } from './components/SearchPanel';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900">
      <ReactFlowProvider>
        <Toolbar />
        <TagPanel />
        <SearchPanel />
        <MindMap />
      </ReactFlowProvider>
    </div>
  );
}

export default App;