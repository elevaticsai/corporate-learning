import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { loginIntsructor, getCourseStatusDistribution, getModuleCounts, getInstructorModules, deleteModule } from '../../utils/api.js';  // Import the API functions
const courseEngagementData = [
  { month: 'Jan', students: 65 },
  { month: 'Feb', students: 85 },
  { month: 'Mar', students: 120 },
  { month: 'Apr', students: 175 },
  { month: 'May', students: 230 },
  { month: 'Jun', students: 280 },
];
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#A855F7', // Violet
  '#22C55E', // Emerald
  '#EAB308', // Yellow
  '#C026D3', // Fuchsia
  '#4ADE80', // Light Green
  '#60A5FA', // Light Blue
  '#FB923C', // Orange
];

const coursesData = [
  {
    id: 1,
    name: 'Mandatory POSH Training',
    category: 'Compliance',
    status: 'Published',
    students: 156,
    lastUpdated: '2024-03-15',
    thumbnail: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 2,
    name: 'Business Code of Conduct',
    category: 'Professional Ethics',
    status: 'Pending',
    students: 0,
    lastUpdated: '2024-03-18',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    name: 'Training on Grievance Management',
    category: 'Management',
    status: 'Published',
    students: 89,
    lastUpdated: '2024-03-10',
    thumbnail: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&auto=format&fit=crop&q=60',
  },
];

const categories = ['All Categories', 'Compliance', 'Professional Ethics', 'Management', 'Technical', 'Soft Skills'];

const MetricCard = ({ icon: Icon, title, value, trend }: { icon: any, title: string, value: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      {trend && (
        <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      )}
    </div>
    <h3 className="mt-4 text-gray-600 text-sm font-medium">{title}</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State to store fetched data
  const [courseStatusData, setCourseStatusData] = useState([]);
  const [moduleCounts, setModuleCounts] = useState(null);
  const [coursesData, setCoursesData] = useState([]);  // You can also populate this with API data

  useEffect(() => {
    const fetchData = async () => {
      // Get token first
      const token = await loginIntsructor();

      // Fetch course status distribution and module counts
      const statusDistribution = await getCourseStatusDistribution(token);
      const counts = await getModuleCounts(token);
      // Update state with fetched data
      console.log(statusDistribution, "statusDistribution")
      console.log(counts, "counts")
      setCourseStatusData(statusDistribution);
      setModuleCounts(counts);

      // You can also fetch courses here if needed
      const courses = await getInstructorModules(token);
      setCoursesData(courses);
    };

    fetchData();
  }, []);  // Empty dependency array ensures this only runs once on component mount

  const handleCreateCourse = (courseId) => {
    navigate('/courses/create');
  };

  const handleEditCourse = (courseId) => {
    navigate('/courses/edit/' + courseId);
  };



  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      const token = await loginIntsructor();
      await deleteModule(token, courseToDelete);

      setCoursesData((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseToDelete)
      );

      setShowConfirmModal(false); // Close modal after deleting
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Open the confirmation modal
  const confirmDelete = (courseId) => {
    setCourseToDelete(courseId);
    setShowConfirmModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
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
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            textAlign: "center",
            width: "350px",
            animation: "fadeIn 0.3s ease-in-out"
          }}>
            <h2 style={{ fontSize: "20px", color: "#333" }}>Confirm Deletion</h2>
            <p style={{ margin: "15px 0", color: "#666" }}>
              Are you sure you want to delete this course? This action cannot be undone.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              {/* Cancel Button */}
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#ccc",
                  color: "#333",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none"
                }}>
                Cancel
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDeleteCourse}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  border: "none"
                }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Header with Welcome Message and Create Button */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Welcome, Instructor</h1>
          <p className="text-gray-500">Manage your courses and track their performance</p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create a New Course
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={BookOpen}
          title="Total Courses"
          value={moduleCounts?.total || "0"}  // Assuming 'totalCourses' is a field
          trend="+12 this month"
        />
        <MetricCard
          icon={CheckCircle}
          title="Published Courses"
          value={moduleCounts?.published || "0"}  // Assuming 'publishedCourses' is a field
          trend="+5 this week"
        />
        <MetricCard
          icon={Clock}
          title="Pending Approval"
          value={moduleCounts?.pending || "0"}  // Assuming 'pendingCourses' is a field
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Course Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  fill="#8884d8"
                >
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Engagement Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Engagement Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h3 className="text-lg font-medium text-gray-900">Your Courses</h3>
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {coursesData.map(course => (
            <div key={course._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img src={course.imgUrl} alt={course.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{course.category}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.status === 'published' ? 'bg-green-100 text-green-800' : course.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{course.status}</span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{course.title}</h4>
                <span className="text-sm text-gray-500">Last updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditCourse(course._id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>


                  <button
                    onClick={() => confirmDelete(course._id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;