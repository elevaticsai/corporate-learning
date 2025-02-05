// import React, { useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   ChevronRight,
//   CheckCircle,
//   PlayCircle,
//   Clock,
//   Volume2,
//   VolumeX,
//   ChevronLeft,
//   ChevronRight as ChevronNextIcon,
//   Maximize2,
//   Pause,
// } from "lucide-react";

// // Updated mock data with chapter descriptions
// const trainingDetails = {
//   id: 1,
//   title: "Mandatory POSH Training",
//   image:
//     "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
//   description:
//     "POSH (Proper Observance of Safety and Health) Mandatory Training is a required program for employees in the healthcare industry, specifically in hospitals and long-term care facilities. The goal of this training is to ensure that staff members are aware of and understand their roles and responsibilities in maintaining a safe and healthy work environment.",
//   duration: "2 hours",
//   instructor: "Sarah Wilson",
//   progress: 93,
//   chapters: [
//     {
//       id: 1,
//       title: "Introduction to POSH",
//       description:
//         "Get started with the fundamental concepts of workplace safety and health. Learn about the history of POSH regulations and why they are crucial for modern workplaces. This chapter sets the foundation for understanding workplace safety protocols.",
//       duration: "15 mins",
//       status: "completed",
//       content:
//         "This chapter introduces the fundamental concepts of POSH and its importance in the workplace.",
//       video: "https://example.com/video1.mp4",
//       audio: true,
//     },
//     {
//       id: 2,
//       title: "Objective of the Training",
//       description:
//         "Explore the key goals and intended outcomes of this training program. Understand how these objectives align with organizational safety standards and regulatory requirements. Learn about measurable outcomes and success criteria.",
//       duration: "20 mins",
//       status: "completed",
//       content:
//         "Understanding the key objectives and expected outcomes of the POSH training program.",
//       video: "https://example.com/video2.mp4",
//       audio: true,
//     },
//     {
//       id: 3,
//       title: "Legal Framework",
//       description:
//         "Dive into the legal aspects of workplace safety and health regulations. Understand your rights and responsibilities under current legislation. Learn about compliance requirements and potential consequences of non-compliance.",
//       duration: "25 mins",
//       status: "completed",
//     },
//     {
//       id: 4,
//       title: "Internal Committee",
//       description:
//         "Learn about the structure and function of internal safety committees. Understand roles, responsibilities, and best practices for committee operations. Discover how to effectively participate in safety initiatives.",
//       duration: "30 mins",
//       status: "completed",
//     },
//     {
//       id: 5,
//       title: "Sexual Harassment",
//       description:
//         "Understand what constitutes sexual harassment in the workplace. Learn to identify different forms of harassment and their impact on individuals and the work environment. Explore prevention strategies and reporting procedures.",
//       duration: "20 mins",
//       status: "completed",
//     },
//     {
//       id: 6,
//       title: "Types of Sexual Harassment",
//       description:
//         "Examine various forms of workplace harassment through detailed examples and case studies. Learn to recognize subtle forms of harassment and understand appropriate responses. Develop skills for preventing and addressing different types of harassment.",
//       duration: "25 mins",
//       status: "completed",
//     },
//     {
//       id: 7,
//       title: "Hostile Work Environment",
//       description:
//         "Explore factors that contribute to a hostile work environment. Learn to identify warning signs and understand the impact on employee well-being. Discover strategies for promoting a positive workplace culture.",
//       duration: "20 mins",
//       status: "in-progress",
//     },
//     {
//       id: 8,
//       title: "Work Place and Work Environment",
//       description:
//         "Analyze the physical and psychological aspects of workplace safety. Understand how environmental factors affect employee well-being. Learn about ergonomics and workplace design principles.",
//       duration: "15 mins",
//       status: "pending",
//     },
//     {
//       id: 9,
//       title: "Behaviors",
//       description:
//         "Study appropriate workplace behaviors and professional conduct. Learn about behavioral expectations and their impact on workplace safety. Develop skills for maintaining professional relationships.",
//       duration: "20 mins",
//       status: "pending",
//     },
//     {
//       id: 10,
//       title: "The Impact",
//       description:
//         "Understand the long-term effects of workplace safety practices on organizations and individuals. Explore case studies of successful safety implementations and their outcomes. Learn about measuring and evaluating safety program effectiveness.",
//       duration: "15 mins",
//       status: "pending",
//     },
//   ],
// };

// const TrainingDetails = () => {
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedChapter, setSelectedChapter] = useState(
//     trainingDetails.chapters[0]
//   );
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   const handleChapterSelect = (chapter) => {
//     setSelectedChapter(chapter);
//     setActiveTab("content");
//   };

//   const handleNextChapter = () => {
//     const currentIndex = trainingDetails.chapters.findIndex(
//       (ch) => ch.id === selectedChapter.id
//     );
//     if (currentIndex < trainingDetails.chapters.length - 1) {
//       setSelectedChapter(trainingDetails.chapters[currentIndex + 1]);
//     }
//   };

//   const handlePreviousChapter = () => {
//     const currentIndex = trainingDetails.chapters.findIndex(
//       (ch) => ch.id === selectedChapter.id
//     );
//     if (currentIndex > 0) {
//       setSelectedChapter(trainingDetails.chapters[currentIndex - 1]);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//       {/* Breadcrumb */}
//       <nav className="flex items-center space-x-2 text-sm text-gray-500">
//         <Link to="/admin/employee" className="hover:text-gray-700">
//           Home
//         </Link>
//         <ChevronRight className="w-4 h-4" />
//         <Link to="/admin/employee" className="hover:text-gray-700">
//           Dashboard
//         </Link>
//         <ChevronRight className="w-4 h-4" />
//         <span className="text-gray-900">Course</span>
//       </nav>

//       {/* Main Content */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         {activeTab === "overview" ? (
//           <>
//             {/* Header Section */}
//             <div className="relative h-64">
//               <img
//                 src={trainingDetails.image}
//                 alt={trainingDetails.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/40"></div>
//               <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
//                 <h1 className="text-3xl font-semibold mb-2">
//                   {trainingDetails.title}
//                 </h1>
//                 <div className="flex items-center space-x-4 text-sm">
//                   <span>Instructor: {trainingDetails.instructor}</span>
//                   <span>•</span>
//                   <span>Duration: {trainingDetails.duration}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="p-8 border-b border-gray-100">
//               <div className="flex justify-between text-sm text-gray-600 mb-2">
//                 <span>Course Progress</span>
//                 <span>{trainingDetails.progress}% Complete</span>
//               </div>
//               <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-blue-500 rounded-full transition-all duration-500"
//                   style={{ width: `${trainingDetails.progress}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-8 space-y-8">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                   About This Course
//                 </h2>
//                 <p className="text-gray-600 leading-relaxed">
//                   {trainingDetails.description}
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                   Course Content
//                 </h2>
//                 <div className="space-y-4">
//                   {trainingDetails.chapters.map((chapter) => (
//                     <div
//                       key={chapter.id}
//                       className="bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer overflow-hidden"
//                       onClick={() => handleChapterSelect(chapter)}
//                     >
//                       <div className="p-4 flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                           {chapter.status === "completed" ? (
//                             <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                           ) : chapter.status === "in-progress" ? (
//                             <PlayCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
//                           ) : (
//                             <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                           )}
//                           <div>
//                             <h3 className="font-medium text-gray-900">
//                               {chapter.title}
//                             </h3>
//                             <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                               {chapter.description}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-4 ml-4">
//                           <span className="text-sm text-gray-500 whitespace-nowrap">
//                             {chapter.duration}
//                           </span>
//                           {chapter.status === "completed" && (
//                             <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
//                               Completed
//                             </span>
//                           )}
//                           {chapter.status === "in-progress" && (
//                             <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
//                               In Progress
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex h-[calc(100vh-12rem)]">
//             {/* Content Panel */}
//             <div className="w-1/2 p-8 border-r border-gray-100 overflow-y-auto">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//                 {selectedChapter.title}
//               </h2>
//               <div className="prose prose-blue max-w-none">
//                 {selectedChapter.content}
//               </div>
//             </div>

//             {/* Media Panel */}
//             <div className="w-1/2 flex flex-col">
//               {/* Video/Image Container */}
//               <div className="relative flex-1 bg-gray-900">
//                 <img
//                   src={trainingDetails.image}
//                   alt={selectedChapter.title}
//                   className="w-full h-full object-cover"
//                 />

//                 {/* Media Controls */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
//                   <div className="flex items-center justify-between text-white">
//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={() => setIsPlaying(!isPlaying)}
//                         className="p-2 hover:bg-white/20 rounded-full transition"
//                       >
//                         {isPlaying ? (
//                           <Pause className="w-6 h-6" />
//                         ) : (
//                           <PlayCircle className="w-6 h-6" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setIsMuted(!isMuted)}
//                         className="p-2 hover:bg-white/20 rounded-full transition"
//                       >
//                         {isMuted ? (
//                           <VolumeX className="w-6 h-6" />
//                         ) : (
//                           <Volume2 className="w-6 h-6" />
//                         )}
//                       </button>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <button
//                         onClick={handlePreviousChapter}
//                         className="p-2 hover:bg-white/20 rounded-full transition"
//                         disabled={
//                           selectedChapter.id === trainingDetails.chapters[0].id
//                         }
//                       >
//                         <ChevronLeft className="w-6 h-6" />
//                       </button>
//                       <button
//                         onClick={handleNextChapter}
//                         className="p-2 hover:bg-white/20 rounded-full transition"
//                         disabled={
//                           selectedChapter.id ===
//                           trainingDetails.chapters[
//                             trainingDetails.chapters.length - 1
//                           ].id
//                         }
//                       >
//                         <ChevronNextIcon className="w-6 h-6" />
//                       </button>
//                       <button
//                         onClick={() => setIsFullscreen(!isFullscreen)}
//                         className="p-2 hover:bg-white/20 rounded-full transition"
//                       >
//                         <Maximize2 className="w-6 h-6" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Chapter Navigation */}
//               <div className="p-4 bg-gray-50 border-t border-gray-100">
//                 <div className="flex justify-between items-center">
//                   <button
//                     onClick={handlePreviousChapter}
//                     className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={
//                       selectedChapter.id === trainingDetails.chapters[0].id
//                     }
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                     <span>Previous Chapter</span>
//                   </button>
//                   <button
//                     onClick={handleNextChapter}
//                     className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
//                     disabled={
//                       selectedChapter.id ===
//                       trainingDetails.chapters[
//                         trainingDetails.chapters.length - 1
//                       ].id
//                     }
//                   >
//                     <span>Next Chapter</span>
//                     <ChevronNextIcon className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrainingDetails;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   ChevronRight,
//   CheckCircle,
//   PlayCircle,
//   Clock,
//   ChevronLeft,
// } from "lucide-react";

// const TrainingDetails = () => {
//   const { id } = useParams();
//   const [trainingDetails, setTrainingDetails] = useState<any>(null);
//   const [selectedChapter, setSelectedChapter] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null); // Specify error type here

//   useEffect(() => {
//     const fetchTrainingDetails = async () => {
//       try {
//         //  const token = localStorage.getItem("authToken");
//         const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzYzYTQ0YmJlM2RkOTk2ZTFjZDYxYTEiLCJyb2xlIjoiRU1QTE9ZRUUiLCJpYXQiOjE3MzgyMzM3MTQsImV4cCI6MTczODMyMDExNH0.3UxPVX1Sh6BtWgPfe10my6BBipe9G68ALMBP8TeWe68`;

//         const response = await fetch(`http://localhost:4000/api/module/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`, // Add Authorization header
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch data");

//         const data = await response.json();
//         setTrainingDetails(data);
//         setSelectedChapter(data.chapters.length > 0 ? data.chapters[0] : null);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message);
//         } else {
//           setError("An unknown error occurred");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrainingDetails();
//   }, [id]);

//   if (loading) return <p className="text-center text-gray-600">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//       {/* Breadcrumb */}
//       <nav className="flex items-center space-x-2 text-sm text-gray-500">
//         <Link to="/" className="hover:text-gray-700">
//           Home
//         </Link>
//         <ChevronRight className="w-4 h-4" />
//         <span className="text-gray-900">{trainingDetails.title}</span>
//       </nav>

//       {/* Main Content */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         {/* Header */}
//         <div className="relative h-64">
//           <img
//             src={trainingDetails.imgUrl}
//             alt={trainingDetails.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/40"></div>
//           <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
//             <h1 className="text-3xl font-semibold mb-2">
//               {trainingDetails.title}
//             </h1>
//           </div>
//         </div>

//         {/* Course Content */}
//         <div className="p-8 space-y-8">
//           <h2 className="text-xl font-semibold text-gray-900">
//             About This Course
//           </h2>
//           <p className="text-gray-600">{trainingDetails.description}</p>

//           <h2 className="text-xl font-semibold text-gray-900">Chapters</h2>
//           <div className="space-y-4">
//             {trainingDetails.chapters.map((chapter: any) => (
//               <div
//                 key={chapter._id}
//                 className={`p-4 rounded-lg cursor-pointer ${
//                   selectedChapter?._id === chapter._id
//                     ? "bg-gray-100"
//                     : "bg-gray-50"
//                 }`}
//                 onClick={() => setSelectedChapter(chapter)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     {chapter.isCompleted ? (
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                     ) : (
//                       <Clock className="w-5 h-5 text-gray-400" />
//                     )}
//                     <h3 className="font-medium text-gray-900">
//                       {chapter.title}
//                     </h3>
//                   </div>
//                   <ChevronRight className="w-5 h-5 text-gray-500" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Selected Chapter Content */}
//         {selectedChapter && (
//           <div className="p-8 border-t border-gray-200">
//             <h2 className="text-2xl font-semibold text-gray-900">
//               {selectedChapter.title}
//             </h2>
//             <p
//               className="text-gray-600 mt-2"
//               dangerouslySetInnerHTML={{ __html: selectedChapter.description }}
//             ></p>

//             {/* Media Content */}
//             {selectedChapter.content?.videoUrl && (
//               <div className="mt-4">
//                 <video controls className="w-full max-h-96 rounded-lg">
//                   <source
//                     src={selectedChapter.content.videoUrl}
//                     type="video/mp4"
//                   />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TrainingDetails;

// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import {
//   ChevronRight,
//   PlayCircle,
//   Volume2,
//   VolumeX,
//   ChevronLeft,
//   Maximize2,
//   Pause,
// } from "lucide-react";
// import axios from "axios";

// // Define the Chapter interface
// interface Chapter {
//   _id: string;
//   title: string;
//   description: string;
//   order: number;
//   template: string;
//   content?: {
//     imgUrl?: string;
//     audioUrl?: string;
//     videoUrl?: string;
//   };
// }

// const TrainingDetails = () => {
//   const { id } = useParams();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [trainingDetails, setTrainingDetails] = useState<any>(null); // Use 'any' or a specific type for trainingDetails
//   const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null); // Specify the type for selectedChapter
//   const [chapterDetails, setChapterDetails] = useState<any>(null); // Specify the type for chapterDetails
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);

//   // Function to fetch module data with authorization token
//   useEffect(() => {
//     const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzYzYTQ0YmJlM2RkOTk2ZTFjZDYxYTEiLCJyb2xlIjoiRU1QTE9ZRUUiLCJpYXQiOjE3MzgyMzM3MTQsImV4cCI6MTczODMyMDExNH0.3UxPVX1Sh6BtWgPfe10my6BBipe9G68ALMBP8TeWe68`; // Get token from localStorage

//     if (token) {
//       axios
//         .get(`http://localhost:4000/api/module/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((response) => {
//           setTrainingDetails(response.data);
//           setSelectedChapter(response.data.chapters[0]);
//         })
//         .catch((error) => console.error("Error fetching module data:", error));
//     } else {
//       console.error("No token found");
//     }
//   }, [id]);

//   // Function to handle chapter selection with authorization token
//   const handleChapterSelect = (chapter: Chapter) => {
//     setSelectedChapter(chapter);
//     setActiveTab("content");

//     const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzYzYTQ0YmJlM2RkOTk2ZTFjZDYxYTEiLCJyb2xlIjoiRU1QTE9ZRUUiLCJpYXQiOjE3MzgyMzM3MTQsImV4cCI6MTczODMyMDExNH0.3UxPVX1Sh6BtWgPfe10my6BBipe9G68ALMBP8TeWe68`; // Get token from localStorage

//     if (token) {
//       // Fetch the chapter content using the chapter's ID
//       axios
//         .get(
//           `http://localhost:4000/api/section?id=${chapter._id}&type=chapter`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         )
//         .then((response) => {
//           setChapterDetails(response.data.currentItem); // Set the chapter details from the API response
//         })
//         .catch((error) =>
//           console.error("Error fetching chapter content:", error)
//         );
//     } else {
//       console.error("No token found");
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
//       <nav className="flex items-center space-x-2 text-sm text-gray-500">
//         <Link to="/admin/employee" className="hover:text-gray-700">
//           Home
//         </Link>
//         <ChevronRight className="w-4 h-4" />
//         <Link to="/admin/employee" className="hover:text-gray-700">
//           Dashboard
//         </Link>
//         <ChevronRight className="w-4 h-4" />
//         <span className="text-gray-900">Course</span>
//       </nav>

//       {trainingDetails && (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="relative h-64">
//             <img
//               src={trainingDetails.imgUrl}
//               alt={trainingDetails.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-black/40"></div>
//             <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
//               <h1 className="text-3xl font-semibold mb-2">
//                 {trainingDetails.title}
//               </h1>
//             </div>
//           </div>

//           <div className="p-8">
//             <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
//             <ul>
//               {trainingDetails.chapters.map((chapter: Chapter) => (
//                 <li key={chapter._id} className="py-2 border-b">
//                   <button
//                     onClick={() => handleChapterSelect(chapter)}
//                     className="text-blue-500 hover:underline"
//                   >
//                     {chapter.title}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       {selectedChapter && activeTab === "content" && chapterDetails && (
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8">
//           <h2 className="text-2xl font-semibold mb-4">
//             {chapterDetails.title}
//           </h2>
//           <p
//             className="mb-4"
//             dangerouslySetInnerHTML={{ __html: chapterDetails.description }}
//           ></p>
//           {chapterDetails.content && (
//             <div className="space-y-4">
//               {chapterDetails.content.imgUrl && (
//                 <img
//                   src={chapterDetails.content.imgUrl}
//                   alt="Chapter"
//                   className="w-full h-64 object-cover"
//                 />
//               )}
//               {chapterDetails.content.audioUrl && (
//                 <audio controls>
//                   <source
//                     src={chapterDetails.content.audioUrl}
//                     type="audio/mp3"
//                   />
//                 </audio>
//               )}
//               {chapterDetails.content.videoUrl && (
//                 <video controls className="w-full">
//                   <source
//                     src={chapterDetails.content.videoUrl}
//                     type="video/mp4"
//                   />
//                 </video>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainingDetails;

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight as ChevronNextIcon,
  Maximize2,
  PlayCircle,
  Pause,
  CheckCircle,
  Clock,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";
import axios from "axios";

// Interfaces
interface ChapterContent {
  imgUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string[];
}
interface Chapter {
  _id: string;
  title: string;
  description: string;
  content: ChapterContent;
  isCompleted: true | false;
  duration: string;
}

const TrainingDetails = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [questionPanel, setQuestionPanel] = useState("overview");

  const [trainingDetails, setTrainingDetails] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [nextQuestionId, setNextQuestionId] = useState<string | null>(null);
  const [prevQuestionId, setPrevQuestionId] = useState<string | null>(null);

  const [userAnswer, setUserAnswer] = useState<string | null>(null); // Track the selected answer
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Media control states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      // Ensure audio is unmuted and can play
      audioRef.current.muted = false;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    } else {
      audioRef.current.pause();
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };
  const handleNextQuestionAndClosePopup = () => {
    // Close the popup
    setIsPopupVisible(false);

    // Move to the next question
    handleNextQuestion();
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get(`http://localhost:4000/api/module/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTrainingDetails(response.data);
        setSelectedChapter(response.data.chapters[0]);
      })
      .catch((error) => console.error("Error fetching module data:", error));
  }, [id]);

  const handleChapterSelect = (chapterId: string) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get(`http://localhost:4000/api/section?id=${chapterId}&type=chapter`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedChapter: Chapter = response.data.currentItem;
        setSelectedChapter(fetchedChapter);
        setActiveTab("content");
        setQuestionPanel("content");

        // Check if nextItem is a question and fetch it
        if (response.data.nextItem?.itemType === "question") {
          fetchQuestion(response.data.nextItem.data);
        }
      })
      .catch((error) =>
        console.error("Error fetching chapter content:", error)
      );
  };

  const fetchQuestion = (questionId: string) => {
    axios
      .get(`http://localhost:4000/api/section?id=${questionId}&type=question`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuestion(response.data.currentItem);
        setCurrentQuestionId(response.data.currentItem._id);
        setNextQuestionId(response.data.nextItem?.data || null);
        setPrevQuestionId(response.data.prevItem?.data || null);
        setQuestionPanel("overview");
      })
      .catch((error) => console.error("Error fetching question:", error));
  };

  const handleNextQuestion = () => {
    if (nextQuestionId) {
      fetchQuestion(nextQuestionId);
    }
  };
  const handlePrevQuestion = () => {
    if (!prevQuestionId) {
      console.log(
        "First question detected. Going back to the previous chapter..."
      );

      const previousChapter = getPreviousChapter();
      if (previousChapter) {
        console.log("Navigating to previous chapter:", previousChapter.title);
        handleChapterSelect(previousChapter._id); // Load previous chapter
      } else {
        console.log("No previous chapter found.");
      }
    } else {
      console.log("Navigating to previous question:", prevQuestionId);
      fetchQuestion(prevQuestionId);
    }
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !question) return;

    const isCorrect = selectedAnswer === question.answer[0];

    // Set the states to show the result popup
    setIsAnswerCorrect(isCorrect);
    setIsPopupVisible(true);
    // Post the selected answer to check if it's correct
    axios
      .post(
        "http://localhost:4000/api/question-complete",
        {
          questionId: question._id,
          moduleId: id,
          answer: selectedAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const isCorrect = response.data.correct;
        console.log(isCorrect);

        // If there's a next question, load it after a short delay
        if (response.data.nextItem) {
          setTimeout(() => {
            fetchQuestion(response.data.nextItem.data); // Fetch next question
            setIsPopupVisible(false); // Hide popup when moving to the next question
          }, 2000); // 2 seconds delay before moving to the next question
        }
      })
      .catch((error) => console.error("Error submitting answer:", error));
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswer(answer);
  };

  const getNextChapter = () => {
    if (!selectedChapter || !trainingDetails) return null;
    const currentIndex = trainingDetails.chapters.findIndex(
      (chapter: Chapter) => chapter._id === selectedChapter._id
    );
    return currentIndex + 1 < trainingDetails.chapters.length
      ? trainingDetails.chapters[currentIndex + 1]
      : null;
  };

  const getPreviousChapter = () => {
    if (!selectedChapter || !trainingDetails) return null;
    const currentIndex = trainingDetails.chapters.findIndex(
      (chapter: Chapter) => chapter._id === selectedChapter._id
    );
    return currentIndex - 1 >= 0
      ? trainingDetails.chapters[currentIndex - 1]
      : null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/employee" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronNextIcon className="w-4 h-4" />
        <Link to="/employee" className="hover:text-gray-700">
          Dashboard
        </Link>
        <ChevronNextIcon className="w-4 h-4" />
        <span className="text-gray-900">Course</span>
      </nav>

      {/* Conditional Rendering for Tabs */}
      {activeTab === "overview" ? (
        <>
          {/* Course Overview */}
          {trainingDetails && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Course Banner */}
              <div className="relative h-64">
                <img
                  src={trainingDetails.imgUrl}
                  alt={trainingDetails.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="text-3xl font-semibold mb-2">
                    {trainingDetails.title}
                  </h1>
                </div>
              </div>

              {/* Course Chapters */}
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About This Course
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {trainingDetails.description}
                  </p>
                </div>{" "}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Course Content
                  </h2>
                  <div className="space-y-4">
                    {trainingDetails.chapters.map((chapter: Chapter) => (
                      <div
                        key={chapter._id}
                        className="bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer overflow-hidden"
                        onClick={() => handleChapterSelect(chapter._id)}
                      >
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {chapter.isCompleted === true ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : chapter.isCompleted === false ? (
                              <PlayCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            ) : (
                              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {chapter.title}
                              </h3>
                              <p
                                className="text-sm text-gray-600 mt-1 line-clamp-2"
                                dangerouslySetInnerHTML={{
                                  __html: chapter.description,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 ml-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                              {chapter.duration}
                            </span>
                            {chapter.isCompleted === true && (
                              <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
                                Completed
                              </span>
                            )}
                            {chapter.isCompleted === false && (
                              <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {questionPanel === "content" ? (
            <>
              {/* Main Content Panel */}
              <div className="flex h-[calc(100vh-12rem)]">
                {/* Content Panel */}
                {selectedChapter ? (
                  <div className="w-1/2 p-8 border-r border-gray-100 overflow-y-auto bg-white rounded-xl shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                      {selectedChapter.title}
                    </h2>
                    <div
                      className="prose prose-blue max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: selectedChapter.description,
                      }}
                    ></div>
                  </div>
                ) : (
                  <div className="w-1/2 p-8 border-r border-gray-100 overflow-y-auto bg-white rounded-xl shadow-sm">
                    <p className="text-gray-500">Loading chapter content...</p>
                  </div>
                )}

                {/* Media Panel */}
                <div className="w-1/2 flex flex-col">
                  <div className="relative flex-1 bg-gray-900">
                    <img
                      src={selectedChapter?.content?.imgUrl}
                      alt={selectedChapter?.title || "Media"}
                      className="w-full h-full object-cover"
                    />
                    {/* Media Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-between text-white">
                        {/* Media Controls */}
                        {selectedChapter?.content?.audioUrl && (
                          <div className="absolute bottom-4 left-4 flex items-center space-x-4">
                            <audio
                              ref={audioRef}
                              src={selectedChapter?.content?.audioUrl || ""}
                              onCanPlay={() => console.log("Audio is ready!")}
                            />

                            <button onClick={toggleAudio}>
                              {isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                              ) : (
                                <PlayCircle className="w-6 h-6 text-white" />
                              )}
                            </button>

                            {/* <button onClick={toggleMute}>
                              {isMuted ? (
                                <VolumeX className="w-6 h-6 text-white" />
                              ) : (
                                <Volume2 className="w-6 h-6 text-white" />
                              )}
                            </button> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() =>
                          getPreviousChapter() &&
                          handleChapterSelect(getPreviousChapter()?._id || "")
                        }
                        disabled={!getPreviousChapter()}
                        className={`flex items-center space-x-2 ${
                          !getPreviousChapter()
                            ? "text-gray-300"
                            : "text-gray-500"
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Previous Chapter</span>
                      </button>
                      <button
                        onClick={() =>
                          getNextChapter() &&
                          handleChapterSelect(getNextChapter()?._id || "")
                        }
                        disabled={!getNextChapter()}
                        className={`flex items-center space-x-2 ${
                          !getNextChapter() ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        <span>Next Chapter</span>
                        <ChevronNextIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Question Panel */}
              <div className="p-8 space-y-6">
                {question ? (
                  <h3
                    className="text-lg font-medium text-gray-900 mb-4"
                    dangerouslySetInnerHTML={{ __html: question?.question }}
                  ></h3>
                ) : (
                  <h3 className="text-gray-500">Loading question...</h3>
                )}

                {/* Options */}
                <ul className="space-y-3">
                  {question?.options.map((option, index) => (
                    <li key={index}>
                      <label
                        className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAnswer === option
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-300 bg-white hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option}
                          checked={selectedAnswer === option}
                          onChange={() => setSelectedAnswer(option)}
                          className="hidden"
                        />
                        <span
                          className={`w-6 h-6 flex items-center justify-center border rounded-full text-lg font-bold transition-all ${
                            selectedAnswer === option
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-400 text-gray-400"
                          }`}
                        >
                          {selectedAnswer === option && "✓"}
                        </span>
                        <span className="text-gray-700 text-lg font-medium">
                          {option}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={!prevQuestionId}
                    className={`px-5 py-2 rounded-lg transition-all duration-200 ${
                      prevQuestionId
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 inline-block mr-2" />
                    Previous
                  </button>

                  <button
                    onClick={handleAnswerSubmit}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200"
                  >
                    Submit
                  </button>

                  {/* <button
                    onClick={handleNextQuestion}
                    disabled={!nextQuestionId}
                    className={`px-5 py-2 rounded-lg transition-all duration-200 ${
                      nextQuestionId
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <ChevronNextIcon className="w-5 h-5 inline-block ml-2" />
                  </button> */}
                </div>

                {/* Popup for Correct/Incorrect Answer */}
                {isPopupVisible && (
                  <div
                    onClick={closePopup}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white p-6 rounded-xl shadow-lg text-center max-w-md w-full relative animate-fadeIn"
                    >
                      <button
                        onClick={closePopup}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
                      >
                        ×
                      </button>
                      {isAnswerCorrect ? (
                        <div>
                          <CheckCircle className="text-green-500 text-5xl mx-auto animate-pulse" />
                          <h2 className="text-green-600 font-semibold text-xl mt-4">
                            Correct Answer!
                          </h2>
                          <button
                            onClick={handleNextQuestionAndClosePopup}
                            className="mt-4 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                          >
                            Next Question
                          </button>
                        </div>
                      ) : (
                        <div>
                          <XCircle className="text-red-500 text-5xl mx-auto animate-shake" />
                          <h2 className="text-red-600 font-semibold text-xl mt-4">
                            Oops, Wrong Answer!
                          </h2>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TrainingDetails;
