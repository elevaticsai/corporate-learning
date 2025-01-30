import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';

const ChapterCreation = ({ chapters, onUpdate }) => {
  const [newChapter, setNewChapter] = useState({
    title: '',
    content: '',
    videoUrl: '',
    duration: ''
  });

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.content) {
      onUpdate([...chapters, { ...newChapter, id: Date.now() }]);
      setNewChapter({ title: '', content: '', videoUrl: '', duration: '' });
    }
  };

  const handleRemoveChapter = (id) => {
    onUpdate(chapters.filter(chapter => chapter.id !== id));
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);
    onUpdate(items);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Chapter</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newChapter.title}
            onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
            placeholder="Chapter Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            value={newChapter.content}
            onChange={(e) => setNewChapter({ ...newChapter, content: e.target.value })}
            placeholder="Chapter Content"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="url"
              value={newChapter.videoUrl}
              onChange={(e) => setNewChapter({ ...newChapter, videoUrl: e.target.value })}
              placeholder="Video URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newChapter.duration}
              onChange={(e) => setNewChapter({ ...newChapter, duration: e.target.value })}
              placeholder="Duration (e.g., 15 mins)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddChapter}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Chapter
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  className="cursor-move"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const startIndex = index;
                    const handleMouseMove = (e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const endIndex = Math.floor((e.clientY - rect.top) / rect.height);
                      if (endIndex !== startIndex) {
                        handleReorder(startIndex, endIndex);
                      }
                    };
                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                    }, { once: true });
                  }}
                >
                  <GripVertical className="w-5 h-5 text-gray-400" />
                </button>
                <div>
                  <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                  <p className="text-sm text-gray-500">{chapter.duration}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveChapter(chapter.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChapterCreation;