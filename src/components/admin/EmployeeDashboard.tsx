import React from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  GraduationCap,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
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

// Mock data for charts
const progressData = [
  { month: 'Jan', progress: 65 },
  { month: 'Feb', progress: 75 },
  { month: 'Mar', progress: 85 },
  { month: 'Apr', progress: 90 },
  { month: 'May', progress: 95 },
  { month: 'Jun', progress: 98 },
];

const trainingStatusData = [
  { name: 'Completed', value: 12, color: '#10B981' },
  { name: 'In Progress', value: 5, color: '#3B82F6' },
  { name: 'Pending', value: 3, color: '#F59E0B' },
];

// Mock training data
const upcomingTrainings = [
  {
    id: 1,
    name: 'Advanced Leadership Skills',
    date: '2024-04-01',
    duration: '2 hours',
    instructor: 'Sarah Wilson',
    type: 'Leadership',
  },
  {
    id: 2,
    name: 'Data Privacy Compliance',
    date: '2024-04-15',
    duration: '1.5 hours',
    instructor: 'Michael Brown',
    type: 'Compliance',
  },
  {
    id: 3,
    name: 'Project Management Essentials',
    date: '2024-04-30',
    duration: '3 hours',
    instructor: 'David Lee',
    type: 'Professional Skills',
  },
];

const completedTrainings = [
  {
    id: 1,
    name: 'Workplace Safety',
    completedDate: '2024-03-15',
    score: '95%',
    certificate: true,
  },
  {
    id: 2,
    name: 'Communication Skills',
    completedDate: '2024-03-01',
    score: '88%',
    certificate: true,
  },
  {
    id: 3,
    name: 'Time Management',
    completedDate: '2024-02-15',
    score: '92%',
    certificate: true,
  },
];

const pendingTrainings = [
  {
    id: 1,
    name: 'Cybersecurity Basics',
    dueDate: '2024-05-15',
    priority: 'High',
    type: 'Technical',
  },
  {
    id: 2,
    name: 'Customer Service Excellence',
    dueDate: '2024-05-30',
    priority: 'Medium',
    type: 'Soft Skills',
  },
];

const MetricCard = ({ icon: Icon, title, value, subtitle }: { icon: any, title: string, value: string, subtitle?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
    <h3 className="mt-4 text-gray-600 text-sm font-medium">{title}</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
  </div>
);

const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-500 mt-1">Track your learning progress and upcoming training sessions</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={BookOpen}
          title="Total Trainings"
          value="20"
          subtitle="Assigned courses"
        />
        <MetricCard
          icon={CheckCircle}
          title="Completed"
          value="12"
          subtitle="60% completion rate"
        />
        <MetricCard
          icon={Clock}
          title="In Progress"
          value="5"
          subtitle="Active courses"
        />
        <MetricCard
          icon={Calendar}
          title="Upcoming"
          value="3"
          subtitle="Due this month"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Progress Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="progress" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Training Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trainingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trainingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Training Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Trainings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Trainings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingTrainings.map((training) => (
              <div key={training.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{training.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Instructor: {training.instructor}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {training.type}
                  </span>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {training.date} • {training.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Trainings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Completed Trainings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {completedTrainings.map((training) => (
              <div key={training.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{training.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Completed: {training.completedDate}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{training.score}</span>
                    {training.certificate && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Trainings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Pending Trainings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {pendingTrainings.map((training) => (
            <div key={training.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium text-gray-900">{training.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Due: {training.dueDate}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    training.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {training.priority} Priority
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {training.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;