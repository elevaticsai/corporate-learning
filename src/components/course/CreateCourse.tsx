import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Added useParams to get moduleId from URL
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BasicInfo from './BasicInfo';
import ChapterCreation from './ChapterCreation';
import QuizCreation from './QuizCreation';
import { createModule, loginIntsructor, getModuleById, updateModule } from '../../utils/api.js';

const CreateCourse = () => {
  const { courseId } = useParams(); // To get moduleId from URL if editing an existing course
  const moduleId = courseId;
  const [courseData, setCourseData] = useState({
    basicInfo: {
      title: '',
      description: '',
      image: '',
      category: '',
    },
    chapters: [],
    quizzes: [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (moduleId) {
      setIsEditMode(true);
      const fetchModuleData = async () => {
        try {
          const token = await loginIntsructor();
          const module = await getModuleById(token, moduleId);  // Fetch the existing module data

          console.log("Fetched Module Data:", module); // Log fetched data

          setCourseData({
            basicInfo: {
              title: module.title || '',
              description: module.description || '',
              image: module.imgUrl || '',
              category: module.category || '',
            },
            chapters: module.chapters || [],
            quizzes: module.questions || [],
          });
        } catch (error) {
          console.error('Error fetching module for editing:', error);
        }
      };
      fetchModuleData();
    }
  }, [moduleId]);

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

  const handleSaveCourse = async () => {
    try {
      const token = await loginIntsructor();
      const moduleData = {
        title: courseData.basicInfo.title,
        description: courseData.basicInfo.description,
        imgUrl: courseData.basicInfo.image,
        category: courseData.basicInfo.category,
        chapters: courseData.chapters.map((chapter, index) => ({
          title: chapter.title,
          description: chapter.content,
          order: index + 1,
          template: 'simple',
          content: {
            imgUrl: chapter.imgUrl || 'www.google.com',
            audioUrl: chapter.audioUrl || 'www.google.com',
            videoUrl: chapter.videoUrl || 'www.google.com',
          },
        })),
        questions: courseData.quizzes.map((quiz, index) => ({
          title: quiz.title || 'Test title',
          question: quiz.question,
          options: quiz.options,
          type: quiz.type,
          answer: quiz.correctAnswers,
          order: index + 1,
          template: 'chapter-one',
        })),
      };

      let response;
      if (isEditMode) {
        response = await updateModule(token, moduleId, moduleData);  // Update course if in edit mode
      } else {
        response = await createModule(token, moduleData);  // Create new course if not in edit mode
      }

      console.log('Course saved successfully:', response);
      alert('Course saved successfully!');
      navigate('/admin/instructor');  // Navigate back to courses list or course details
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          {isEditMode ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="mt-2 text-gray-600">{isEditMode ? 'Edit your course details' : 'Create and customize your course content'}</p>
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
            {isEditMode ? 'Update Course' : 'Save Course'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;