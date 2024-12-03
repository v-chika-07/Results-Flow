import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notes: string) => void;
  initialNotes: string;
}

export const NotesDialog: React.FC<NotesDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialNotes,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">Node Notes</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-64 p-3 border rounded-md mb-4 
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Add notes here..."
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(notes);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md 
                     hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};