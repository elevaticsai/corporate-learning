import React from 'react';
import { Users, Clock, BookOpen, UserCheck, AlertCircle, DollarSign } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const mockLineData = [
  { month: 'Jan', users: 65 },
  { month: 'Feb', users: 85 },
  { month: 'Mar', users: 120 },
  { month: 'Apr', users: 175 },
  { month: 'May', users: 230 },
  { month: 'Jun', users: 280 },
];

const mockPieData = [
  { name: 'Leadership', value: 35 },
  { name: 'Technical', value: 25 },
  { name: 'Soft Skills', value: 20 },
  { name: 'Compliance', value: 20 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const mockClients = [
  {
    id: 1,
    name: 'Client A',
    email: 'clientA@example.com',
    company: 'Company XYZ',
    contact: 'John Doe',
    signups: 50,
    invoice: 'INV-2023011',
    amount: 1500.00,
  },
  {
    id: 2,
    name: 'Client B',
    email: 'clientB@example.com',
    company: 'Company ABC',
    contact: 'Jane Smith',
    signups: 30,
    invoice: 'INV-2023012',
    amount: 900.00,
  },
  {
    id: 3,
    name: 'Client C',
    email: 'clientC@example.com',
    company: 'Company DEF',
    contact: 'Michael Brown',
    signups: 75,
    invoice: 'INV-2023013',
    amount: 2250.00,
  },
  {
    id: 4,
    name: 'Client D',
    email: 'clientD@example.com',
    company: 'Company GHI',
    contact: 'Emily Davis',
    signups: 40,
    invoice: '-',
    amount: 0.00,
  },
];

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

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard icon={Users} title="Total Clients" value="156" trend="+12% this month" />
        <MetricCard icon={Clock} title="Pending Approvals" value="23" />
        <MetricCard icon={BookOpen} title="Active Trainings" value="48" trend="+5% this month" />
        <MetricCard icon={UserCheck} title="Total Signups" value="1,234" trend="+8% this month" />
        <MetricCard icon={AlertCircle} title="Expiring Contracts" value="15" />
        <MetricCard icon={DollarSign} title="Monthly Revenue" value="$45,850" trend="+15% this month" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Signup Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Signup Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockLineData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Course Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Client Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Client Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact Person</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Signups</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Invoice Number</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount Paid ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.signups}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.invoice}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {client.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;