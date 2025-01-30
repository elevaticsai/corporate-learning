import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Mock data for the training cards
const assignedTrainings = [
  {
    id: 1,
    title: 'Mandatory POSH Training',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60',
    progress: 93,
    dueDate: '2024-04-15',
    status: 'In Progress'
  },
  {
    id: 2,
    title: 'Business Code of Conduct',
    image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop&q=60',
    progress: 75,
    dueDate: '2024-04-30',
    status: 'In Progress'
  },
  {
    id: 3,
    title: 'Training on Grievance Management',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&auto=format&fit=crop&q=60',
    progress: 50,
    dueDate: '2024-05-15',
    status: 'In Progress'
  }
];

const TrainingCard = ({ training }: { training: any }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/admin/training/${training.id}`)}
    >
      <img 
        src={training.image} 
        alt={training.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{training.title}</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{training.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${training.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Due: {training.dueDate}</span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {training.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-500 mt-1">Track your learning progress and upcoming training sessions</p>
      </div>

      {/* Training Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedTrainings.map((training) => (
          <TrainingCard key={training.id} training={training} />
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;