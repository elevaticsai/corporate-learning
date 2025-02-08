import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Music } from 'lucide-react';
import { uploadImage } from '../../utils/api.js';

const categories = [
  'Development',
  'Business',
  'Design',
  'Marketing',
  'IT & Software',
  'Personal Development',
  'Photography',
  'Music'
];

// const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const BasicInfo = ({ data, onUpdate }) => {
  console.log(data, "basic infor data")
  const [imagePreview, setImagePreview] = useState(data.image || '');
  const [audioFile, setAudioFile] = useState(data.audio || null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  useEffect(() => {
    setImagePreview(data.image || '');
  }, [data.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ [name]: value });
  };

  // Function to handle image file selection
const handleImageChange = async (e) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB');
      return;
    }
    try {
      const uploadResponse = await uploadImage(file);
      console.log(uploadResponse,"upload response")
      setImagePreview(uploadResponse.fileUrl);
      data.image = uploadResponse.fileUrl
    } catch (error) {
      alert('Image upload failed');
    }
  }
};

  // const handleAudioChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     if (file.size > 10 * 1024 * 1024) { // 10MB limit
  //       alert('Audio file size should be less than 10MB');
  //       return;
  //     }

  //     const reader = new FileReader();
      
  //     reader.onloadend = () => {
  //       setAudioFile(file);
  //       onUpdate({ audio: file });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleRemoveImage = () => {
    setImagePreview('');
    onUpdate({ image: '' });
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    onUpdate({ audio: null });
  };

  const handleOutcomesChange = (e) => {
    const outcomes = e.target.value.split('\n').filter(Boolean);
    onUpdate({ learningOutcomes: outcomes });
  };

  const handlePrerequisitesChange = (e) => {
    const prerequisites = e.target.value.split('\n').filter(Boolean);
    onUpdate({ prerequisites });
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title
        </label>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter course title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Description
        </label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe your course"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={data.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <select
            name="level"
            value={data.level}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a level</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div> */}
      </div>
      <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Course Image
  </label>
  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative">
    <div className="space-y-1 text-center">
      {imagePreview ? (
        <div className="relative w-full max-w-xs">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={imagePreview}
              alt="Course preview"
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
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
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <span>Upload a file</span>
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


      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Audio Introduction
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            {audioFile ? (
              <div className="flex items-center justify-center space-x-4">
                <Music className="w-8 h-8 text-blue-500" />
                <span className="text-sm text-gray-600">{audioFile.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Music className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
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
                <p className="text-xs text-gray-500">
                  MP3, WAV up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div> */}

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prerequisites (one per line)
        </label>
        <textarea
          value={data.prerequisites?.join('\n')}
          onChange={handlePrerequisitesChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter prerequisites"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Outcomes (one per line)
        </label>
        <textarea
          value={data.learningOutcomes?.join('\n')}
          onChange={handleOutcomesChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter learning outcomes"
        />
      </div> */}
    </div>
  );
};

export default BasicInfo;