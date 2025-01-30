import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Filter,
  ChevronDown
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for demonstration
const courseStatusData = [
  { name: 'Published', value: 28, color: '#10B981' },
  { name: 'Pending', value: 45, color: '#F59E0B' },
  { name: 'Draft', value: 12, color: '#6B7280' },
];

const courseEngagementData = [
  { month: 'Jan', students: 65 },
  { month: 'Feb', students: 85 },
  { month: 'Mar', students: 120 },
  { month: 'Apr', students: 175 },
  { month: 'May', students: 230 },
  { month: 'Jun', students: 280 },
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

  const handleCreateCourse = () => {
    navigate('/admin/courses/create');
  };

  const handleEditCourse = (courseId: number) => {
    console.log('Edit course:', courseId);
  };

  const handleDeleteCourse = (courseId: number) => {
    console.log('Delete course:', courseId);
  };

  return (
    <div className="space-y-6">
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
          value="85"
          trend="+12 this month"
        />
        <MetricCard
          icon={CheckCircle}
          title="Published Courses"
          value="28"
          trend="+5 this week"
        />
        <MetricCard
          icon={Clock}
          title="Pending Approval"
          value="45"
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
                >
                  {courseStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          {coursesData.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{course.category}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    course.status === 'Published' ? 'bg-green-100 text-green-800' :
                    course.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{course.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.students} Students
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Last updated: {course.lastUpdated}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(course.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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