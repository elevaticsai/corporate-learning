import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  CheckCircle, 
  PlayCircle, 
  Clock, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  ChevronRight as ChevronNextIcon,
  Maximize2,
  Pause
} from 'lucide-react';

// Updated mock data with chapter descriptions
const trainingDetails = {
  id: 1,
  title: 'Mandatory POSH Training',
  image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
  description: 'POSH (Proper Observance of Safety and Health) Mandatory Training is a required program for employees in the healthcare industry, specifically in hospitals and long-term care facilities. The goal of this training is to ensure that staff members are aware of and understand their roles and responsibilities in maintaining a safe and healthy work environment.',
  duration: '2 hours',
  instructor: 'Sarah Wilson',
  progress: 93,
  chapters: [
    {
      id: 1,
      title: 'Introduction to POSH',
      description: 'Get started with the fundamental concepts of workplace safety and health. Learn about the history of POSH regulations and why they are crucial for modern workplaces. This chapter sets the foundation for understanding workplace safety protocols.',
      duration: '15 mins',
      status: 'completed',
      content: 'This chapter introduces the fundamental concepts of POSH and its importance in the workplace.',
      video: 'https://example.com/video1.mp4',
      audio: true
    },
    {
      id: 2,
      title: 'Objective of the Training',
      description: 'Explore the key goals and intended outcomes of this training program. Understand how these objectives align with organizational safety standards and regulatory requirements. Learn about measurable outcomes and success criteria.',
      duration: '20 mins',
      status: 'completed',
      content: 'Understanding the key objectives and expected outcomes of the POSH training program.',
      video: 'https://example.com/video2.mp4',
      audio: true
    },
    {
      id: 3,
      title: 'Legal Framework',
      description: 'Dive into the legal aspects of workplace safety and health regulations. Understand your rights and responsibilities under current legislation. Learn about compliance requirements and potential consequences of non-compliance.',
      duration: '25 mins',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Internal Committee',
      description: 'Learn about the structure and function of internal safety committees. Understand roles, responsibilities, and best practices for committee operations. Discover how to effectively participate in safety initiatives.',
      duration: '30 mins',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Sexual Harassment',
      description: 'Understand what constitutes sexual harassment in the workplace. Learn to identify different forms of harassment and their impact on individuals and the work environment. Explore prevention strategies and reporting procedures.',
      duration: '20 mins',
      status: 'completed'
    },
    {
      id: 6,
      title: 'Types of Sexual Harassment',
      description: 'Examine various forms of workplace harassment through detailed examples and case studies. Learn to recognize subtle forms of harassment and understand appropriate responses. Develop skills for preventing and addressing different types of harassment.',
      duration: '25 mins',
      status: 'completed'
    },
    {
      id: 7,
      title: 'Hostile Work Environment',
      description: 'Explore factors that contribute to a hostile work environment. Learn to identify warning signs and understand the impact on employee well-being. Discover strategies for promoting a positive workplace culture.',
      duration: '20 mins',
      status: 'in-progress'
    },
    {
      id: 8,
      title: 'Work Place and Work Environment',
      description: 'Analyze the physical and psychological aspects of workplace safety. Understand how environmental factors affect employee well-being. Learn about ergonomics and workplace design principles.',
      duration: '15 mins',
      status: 'pending'
    },
    {
      id: 9,
      title: 'Behaviors',
      description: 'Study appropriate workplace behaviors and professional conduct. Learn about behavioral expectations and their impact on workplace safety. Develop skills for maintaining professional relationships.',
      duration: '20 mins',
      status: 'pending'
    },
    {
      id: 10,
      title: 'The Impact',
      description: 'Understand the long-term effects of workplace safety practices on organizations and individuals. Explore case studies of successful safety implementations and their outcomes. Learn about measuring and evaluating safety program effectiveness.',
      duration: '15 mins',
      status: 'pending'
    }
  ]
};

const TrainingDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChapter, setSelectedChapter] = useState(trainingDetails.chapters[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setActiveTab('content');
  };

  const handleNextChapter = () => {
    const currentIndex = trainingDetails.chapters.findIndex(ch => ch.id === selectedChapter.id);
    if (currentIndex < trainingDetails.chapters.length - 1) {
      setSelectedChapter(trainingDetails.chapters[currentIndex + 1]);
    }
  };

  const handlePreviousChapter = () => {
    const currentIndex = trainingDetails.chapters.findIndex(ch => ch.id === selectedChapter.id);
    if (currentIndex > 0) {
      setSelectedChapter(trainingDetails.chapters[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/admin/employee" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/admin/employee" className="hover:text-gray-700">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">Course</span>
      </nav>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {activeTab === 'overview' ? (
          <>
            {/* Header Section */}
            <div className="relative h-64">
              <img
                src={trainingDetails.image}
                alt={trainingDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-3xl font-semibold mb-2">{trainingDetails.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span>Instructor: {trainingDetails.instructor}</span>
                  <span>•</span>
                  <span>Duration: {trainingDetails.duration}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Course Progress</span>
                <span>{trainingDetails.progress}% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${trainingDetails.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Course</h2>
                <p className="text-gray-600 leading-relaxed">
                  {trainingDetails.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-4">
                  {trainingDetails.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer overflow-hidden"
                      onClick={() => handleChapterSelect(chapter)}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {chapter.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : chapter.status === 'in-progress' ? (
                            <PlayCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {chapter.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <span className="text-sm text-gray-500 whitespace-nowrap">{chapter.duration}</span>
                          {chapter.status === 'completed' && (
                            <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
                              Completed
                            </span>
                          )}
                          {chapter.status === 'in-progress' && (
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-[calc(100vh-12rem)]">
            {/* Content Panel */}
            <div className="w-1/2 p-8 border-r border-gray-100 overflow-y-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">{selectedChapter.title}</h2>
              <div className="prose prose-blue max-w-none">
                {selectedChapter.content}
              </div>
            </div>

            {/* Media Panel */}
            <div className="w-1/2 flex flex-col">
              {/* Video/Image Container */}
              <div className="relative flex-1 bg-gray-900">
                <img
                  src={trainingDetails.image}
                  alt={selectedChapter.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Media Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                      >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePreviousChapter}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                        disabled={selectedChapter.id === trainingDetails.chapters[0].id}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextChapter}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                        disabled={selectedChapter.id === trainingDetails.chapters[trainingDetails.chapters.length - 1].id}
                      >
                        <ChevronNextIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-white/20 rounded-full transition"
                      >
                        <Maximize2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter Navigation */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePreviousChapter}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedChapter.id === trainingDetails.chapters[0].id}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous Chapter</span>
                  </button>
                  <button
                    onClick={handleNextChapter}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedChapter.id === trainingDetails.chapters[trainingDetails.chapters.length - 1].id}
                  >
                    <span>Next Chapter</span>
                    <ChevronNextIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingDetails;