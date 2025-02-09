import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Added useParams to get moduleId from URL
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BasicInfo from './BasicInfo';
import ChapterCreation from './ChapterCreation';
import QuizCreation from './QuizCreation';
import { createModule, loginIntsructor, getModuleById, updateModule } from '../../utils/api.js';
import { FaCheckCircle } from "react-icons/fa"; // Green tick icon

const CreateCourse = () => {
  const { courseId } = useParams(); // To get moduleId from URL if editing an existing course
  const moduleId = courseId;
  const [isLoading, setIsLoading] = useState(false);
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




const [successMessage, setSuccessMessage] = useState(false);

const handleSaveCourse = async () => {
  setIsLoading(true);
  try {
    const token = await loginIntsructor();
    const moduleData = {
      title: courseData.basicInfo.title,
      description: courseData.basicInfo.description,
      imgUrl: courseData.basicInfo.image,
      category: courseData.basicInfo.category,
      chapters: courseData.chapters.map((chapter, index) => ({
        title: chapter.title,
        description: chapter.description,
        order: index + 1,
        template: "simple",
        content: {
          imgUrl: chapter.content?.imgUrl || chapter.image || "",
          audioUrl: chapter.content?.audioUrl || chapter.audio || "",
          videoUrl: chapter.content?.videoUrl || "www.google.com",
        },
      })),
      questions: courseData.quizzes.map((quiz, index) => ({
        title: quiz.title || "Test title",
        question: quiz.question,
        options: quiz.options,
        type: quiz.type,
        answer: quiz.correctAnswers,
        order: courseData.chapters.length + index + 1,
        template: "chapter-one",
      })),
    };

    const response = isEditMode
      ? await updateModule(token, moduleId, moduleData)
      : await createModule(token, moduleData);

    setSuccessMessage(true); // Show success popup

    setTimeout(() => {
      setSuccessMessage(false); // Hide message after 3 seconds
      navigate("/instructor");
    }, 3000);
  } catch (error) {
    console.error("Error saving course:", error);
    alert("Failed to save course. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {successMessage && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
    backdropFilter: "blur(5px)", // Blurred background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }}>
    <div style={{
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      animation: "fadeIn 0.3s ease-in-out"
    }}>
      <FaCheckCircle size={50} color="green" />
      <h2 style={{ margin: "15px 0", fontSize: "20px", color: "#333" }}>
        Course Saved Successfully!
      </h2>
    </div>
  </div>
)}

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
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg text-white transition ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } focus:ring-4 focus:ring-blue-200`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                  ></path>
                </svg>

                {isEditMode ? "Updating..." : "Saving..."}
              </div>
            ) : (
              isEditMode ? "Update Course" : "Save Course"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;