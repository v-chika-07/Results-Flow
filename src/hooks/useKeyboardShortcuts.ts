import { useEffect } from 'react';
import { useMindMapStore } from '../store/mindMapStore';

export const useKeyboardShortcuts = () => {
  const { addNode, deleteSelectedNode, deselectAll, navigateNodes } = useMindMapStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case 'n':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            addNode(null);
          }
          break;
        case 'Delete':
          event.preventDefault();
          deleteSelectedNode();
          break;
        case 'Escape':
          event.preventDefault();
          deselectAll();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          event.preventDefault();
          navigateNodes(event.key);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNode, deleteSelectedNode, deselectAll, navigateNodes]);
};