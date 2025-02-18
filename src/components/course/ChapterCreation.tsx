import React, { useState, useRef } from "react";
import { Plus, Trash2, Upload, Music, X, Edit, Layout } from "lucide-react";
import { uploadImage } from "../../utils/api.js";
import { ChapterLayoutSelector, ChapterPreview } from './ChapterLayouts';

const ChapterCreation = ({ chapters, onUpdate }) => {
  const [newChapter, setNewChapter] = useState({
    title: "",
    content: "",
    duration: "",
    image: "",
    audio: "",
    layout: "", // New field for layout selection
  });

  const [editingChapterId, setEditingChapterId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const normalizedChapters = chapters.map((chapter) => ({
    ...chapter,
    content: chapter.content || {
      imgUrl: chapter.image || "",
      audioUrl: chapter.audio || "",
    },
  }));

  const handleAddOrUpdateChapter = () => {
    console.log(newChapter, "new chapter")
    if (newChapter.title && newChapter.content && newChapter.layout) {
      if (editingChapterId !== null) {
        onUpdate(
          normalizedChapters.map((chapter) =>
            chapter.id === editingChapterId
              ? {
                  ...chapter,
                  title: newChapter.title,
                  description: newChapter.content,
                  duration: newChapter.duration,
                  content: {
                    imgUrl: newChapter.image || "",
                    audioUrl: newChapter.audio || "",
                  },
                  layout: newChapter.layout? newChapter.layout: newChapter.template, // Update layout
                }
              : chapter
          )
        );
        setEditingChapterId(null);
      } else {
        onUpdate([
          ...normalizedChapters,
          {
            id: Date.now(),
            title: newChapter.title,
            description: newChapter.content,
            duration: newChapter.duration,
            content: {
              imgUrl: newChapter.image || "",
              audioUrl: newChapter.audio || "",
            },
            layout: newChapter.layout? newChapter.layout: newChapter.template, // Add layout
          },
        ]);
      }
      setNewChapter({
        title: "",
        content: "",
        duration: "",
        image: "",
        audio: "",
        layout: "", // Reset layout
      });
    } else {
      alert('Please fill in all required fields and select a layout');
    }
  };

  const handleRemoveChapter = (id) => {
    onUpdate(normalizedChapters.filter((chapter) => chapter.id !== id));
    if (editingChapterId === id) {
      setEditingChapterId(null);
      setNewChapter({
        title: "",
        content: "",
        duration: "",
        image: "",
        audio: "",
        layout: "", // Reset layout
      });
    }
  };

  const handleEditChapter = (id) => {
    const chapterToEdit = normalizedChapters.find((chapter) => chapter.id === id);
    console.log(chapterToEdit, "chapter to edit")
    if (chapterToEdit) {
      setEditingChapterId(id);
      setNewChapter({
        title: chapterToEdit.title,
        content: chapterToEdit.description || "",
        duration: chapterToEdit.duration || "",
        image: chapterToEdit.content?.imgUrl || "",
        audio: chapterToEdit.content?.audioUrl || "",
        layout: chapterToEdit.template || "", // Set layout
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setNewChapter({
      title: "",
      content: "",
      duration: "",
      image: "",
      audio: "",
      layout: "", // Reset layout
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      setLoading(true);
      try {
        const uploadResponse = await uploadImage(file);
        setNewChapter((prev) => ({
          ...prev,
          image: uploadResponse.fileUrl,
        }));
      } catch (error) {
        alert("Image upload failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAudioChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Audio file size should be less than 10MB");
        return;
      }
      setLoading2(true);
      try {
        const uploadResponse = await uploadImage(file);
        setNewChapter((prev) => ({
          ...prev,
          audio: uploadResponse.fileUrl,
        }));
      } catch (error) {
        alert("Audio upload failed");
      } finally {
        setLoading2(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setNewChapter((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleRemoveAudio = () => {
    setNewChapter((prev) => ({
      ...prev,
      audio: "",
    }));
  };

  const handleLayoutSelect = (layoutName) => {
    setNewChapter((prev) => ({
      ...prev,
      layout: layoutName,
    }));
    setShowLayoutSelector(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-dark-800 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {editingChapterId ? "Edit Chapter" : "Add New Chapter"}
        </h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newChapter.title}
            onChange={(e) =>
              setNewChapter({ ...newChapter, title: e.target.value })
            }
            placeholder="Chapter Title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
          />
          <textarea
            value={newChapter.content}
            onChange={(e) =>
              setNewChapter({ ...newChapter, content: e.target.value })
            }
            placeholder="Chapter Content"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
          />


          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chapter Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-700 border-dashed rounded-lg relative bg-white dark:bg-dark-800">
              {loading && (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
                </div>
              )}
              <div className="space-y-1 text-center">
                {newChapter.image ? (
                  <div className="relative">
                    <img
                      src={newChapter.image}
                      alt="Chapter preview"
                      className="mx-auto w-64 h-40 object-contain rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white dark:bg-dark-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload image</span>
                        <input
                          ref={imageInputRef}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Audio Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chapter Audio
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-dark-700 border-dashed rounded-lg relative bg-white dark:bg-dark-800">
              {loading2 && (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid"></div>
                </div>
              )}
              <div className="space-y-1 text-center">
                {newChapter.audio ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-4">
                      <Music className="w-8 h-8 text-blue-500" />
                      <span className="text-sm text-gray-600">Audio Uploaded</span>
                      <button
                        type="button"
                        onClick={handleRemoveAudio}
                        className="p-1 text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <audio controls className="w-full max-w-xs">
                      <source src={newChapter.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <>
                    <Music className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white dark:bg-dark-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload audio</span>
                        <input
                          ref={audioInputRef}
                          type="file"
                          className="sr-only"
                          accept="audio/*"
                          onChange={handleAudioChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP3, WAV up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
             {/* Layout Selection */}
             <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Chapter Layout
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowLayoutSelector(true)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 flex items-center space-x-2"
              >
                <Layout className="w-5 h-5" />
                <span>{newChapter.layout ? 'Change Layout' : 'Select Layout'}</span>
              </button>
              {newChapter.layout && (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Preview Layout
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={newChapter.duration}
            onChange={(e) =>
              setNewChapter({ ...newChapter, duration: e.target.value })
            }
            placeholder="Duration (e.g., 15 mins)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-800 text-gray-900 dark:text-white"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleAddOrUpdateChapter}
              disabled={!newChapter.title || !newChapter.content || !newChapter.layout}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingChapterId ? "Update Chapter" : "Add Chapter"}
            </button>
            {editingChapterId && (
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-4">
        {normalizedChapters.map((chapter) => (
          <div key={chapter.id} className="bg-white dark:bg-dark-800 p-4 rounded-lg border border-gray-200 dark:border-dark-700 flex items-center justify-between">
            {chapter.content?.imgUrl && (
              <img
                src={chapter.content.imgUrl}
                alt={chapter.title}
                className="w-16 h-16 object-contain rounded mr-4 border"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white truncate">{chapter.title}</h4>
              <p className="text-sm text-gray-500">{chapter.duration}</p>
            </div>
            {chapter.content?.audioUrl && (
              <audio controls className="w-36 mx-4">
                <source src={chapter.content.audioUrl} type="audio/mpeg" />
              </audio>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditChapter(chapter.id)}
                className="p-2 text-gray-400 hover:text-blue-500"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleRemoveChapter(chapter.id)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Selector Modal */}
      {showLayoutSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select Chapter Layout</h3>
              <button
                onClick={() => setShowLayoutSelector(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ChapterLayoutSelector
              selectedLayout={newChapter.layout}
              onLayoutSelect={handleLayoutSelect}
              layoutImage={newChapter.image}
              layoutAudio={newChapter.audio}
            />
          </div>
        </div>
      )}

      {/* Layout Preview Modal */}
      {showPreview && (
        <ChapterPreview
          layout={newChapter.layout}
          layoutImage={newChapter.image}
          layoutAudio={newChapter.audio}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default ChapterCreation;
