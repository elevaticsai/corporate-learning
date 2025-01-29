import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Clock,
  AlertCircle,
  Download,
  Send,
  Search,
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
const trainingEngagementData = [
  { name: 'Technical Skills', completed: 45, pending: 15, overdue: 5 },
  { name: 'Soft Skills', completed: 30, pending: 20, overdue: 8 },
  { name: 'Compliance', completed: 60, pending: 10, overdue: 2 },
  { name: 'Leadership', completed: 25, pending: 25, overdue: 10 },
];

const pieData = [
  { name: 'Completed', value: 160, color: '#10B981' },
  { name: 'Pending', value: 70, color: '#F59E0B' },
  { name: 'Overdue', value: 25, color: '#EF4444' },
];

const employeeData = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    status: 'Completed',
    dueDate: '2024-04-15',
    manager: 'Sarah Wilson',
    course: 'Technical Skills',
  },
  {
    id: 2,
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    status: 'Pending',
    dueDate: '2024-03-30',
    manager: 'Michael Brown',
    course: 'Leadership',
  },
  {
    id: 3,
    name: 'David Lee',
    email: 'david.lee@example.com',
    status: 'Overdue',
    dueDate: '2024-03-01',
    manager: 'Sarah Wilson',
    course: 'Compliance',
  },
  // Add more mock data as needed
];

const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
const trainingTypes = ['All Types', 'Technical Skills', 'Soft Skills', 'Compliance', 'Leadership'];

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

const HRDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All Types');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const handleEmployeeSelect = (id: number) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const handleSendReminders = () => {
    console.log('Sending reminders to:', selectedEmployees);
    // Implement reminder functionality
  };

  const handleExportData = () => {
    console.log('Exporting data...');
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Training Management Dashboard</h1>
        
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Training Type Filter */}
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {trainingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Employees"
          value="255"
          trend="+12 this month"
        />
        <MetricCard
          icon={GraduationCap}
          title="Active Trainings"
          value="48"
          trend="+5 this week"
        />
        <MetricCard
          icon={Clock}
          title="Pending Completion"
          value="70"
        />
        <MetricCard
          icon={AlertCircle}
          title="Overdue Trainings"
          value="25"
          trend="+3 this week"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Engagement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Training Engagement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10B981" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" />
                <Bar dataKey="overdue" stackId="a" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Training Status Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Employee Training Status</h3>
          <div className="flex gap-4">
            <button
              onClick={handleSendReminders}
              disabled={selectedEmployees.length === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Reminders
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 transition"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 px-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEmployees(employeeData.map(emp => emp.id));
                      } else {
                        setSelectedEmployees([]);
                      }
                    }}
                    checked={selectedEmployees.length === employeeData.length}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Employee Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Course</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Manager</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employeeData.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelect(employee.id)}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.course}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      employee.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.dueDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{employee.manager}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;