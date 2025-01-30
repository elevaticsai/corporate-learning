import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BasicInfo from './BasicInfo';
import ChapterCreation from './ChapterCreation';
import QuizCreation from './QuizCreation';

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    basicInfo: {
      title: '',
      description: '',
      image: '',
      category: '',
      level: '',
      prerequisites: [],
      learningOutcomes: []
    },
    chapters: [],
    quizzes: []
  });

  const handleBasicInfoUpdate = (data) => {
    setCourseData(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...data }
    }));
  };

  const handleChapterUpdate = (chapters) => {
    setCourseData(prev => ({
      ...prev,
      chapters
    }));
  };

  const handleQuizUpdate = (quizzes) => {
    setCourseData(prev => ({
      ...prev,
      quizzes
    }));
  };

  const handleSaveCourse = () => {
    // TODO: Implement course saving logic
    console.log('Saving course:', courseData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Create New Course</h1>
        <p className="mt-2 text-gray-600">Create and customize your course content</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <Tabs defaultValue="basic-info" className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="flex">
              <TabsTrigger
                value="basic-info"
                className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:text-gray-700 focus:bg-gray-50"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="chapters"
                className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:text-gray-700 focus:bg-gray-50"
              >
                Chapters
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:text-gray-700 focus:bg-gray-50"
              >
                Quiz
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="basic-info">
              <BasicInfo data={courseData.basicInfo} onUpdate={handleBasicInfoUpdate} />
            </TabsContent>
            <TabsContent value="chapters">
              <ChapterCreation chapters={courseData.chapters} onUpdate={handleChapterUpdate} />
            </TabsContent>
            <TabsContent value="quiz">
              <QuizCreation quizzes={courseData.quizzes} onUpdate={handleQuizUpdate} />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleSaveCourse}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;