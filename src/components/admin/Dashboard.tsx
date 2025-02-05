import React, { useState, useEffect } from 'react';
import { Users, Clock, BookOpen, UserCheck, AlertCircle, DollarSign } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { login, getDashboardData, getTotalSignups, getCourseDistribution, getClientOnboardingDetails } from '../../utils/api.js'; // Import the utility functions

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

const Dashboard = () => {
  const [token, setToken] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [signupsData, setSignupsData] = useState(null);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [onboardingData, setOnboardingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await login();
        setToken(token);
        const data = await getDashboardData(token);
        const signups = await getTotalSignups(token);
        const courseData = await getCourseDistribution(token);
        const onboardingDetails = await getClientOnboardingDetails(token);
        setDashboardData(data);
        console.log(data,"data")
        console.log(signups,"signuops")
        setSignupsData(signups);

        setCourseDistribution(courseData.distribution);
        console.log(onboardingDetails,"onboading data")
        setOnboardingData(onboardingDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  
  if (!dashboardData || !signupsData || !courseDistribution.length || !onboardingData) {
    return <div>Loading...</div>;
  }


  const { totalSignups, currentMonthSignups, previousMonthSignups, growthPercentage, monthToDate } = signupsData;


  const { clientStats, signupStats, pendingStats, trainingStats } = dashboardData;

  const lineData = [
    { month: 'Previous Month', users: previousMonthSignups },
    { month: monthToDate, users: currentMonthSignups }
  ];


  const pieData = courseDistribution.map((stat) => ({
    name: stat.category,
    value: stat.count,
  }));

  const MetricCard = ({ icon: Icon, title, value, trend }) => {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
          {trend && (
            <p className="text-sm text-green-600">
              {trend}
            </p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <MetricCard icon={Users} title="Total Clients" value={onboardingData.length} trend="+12% this month" />
        <MetricCard icon={Clock} title="Pending Approvals" value={recentUsers.filter(user => user.isApproved === 'pending').length} />
        <MetricCard icon={BookOpen} title="Active Trainings" value={recentCourses.length} trend="+5% this month" />
        <MetricCard icon={UserCheck} title="Total Signups" value={totalSignups} trend={`${growthPercentage}% growth`} />
        <MetricCard icon={AlertCircle} title="Expiring Contracts" value="15" />
        <MetricCard icon={DollarSign} title="Monthly Revenue" value="$45,850" trend="+15% this month" /> */}

        <MetricCard icon={Users} title="Total Managers" value={clientStats.totalManagers} />
        <MetricCard icon={Clock} title="Pending Clients" value={clientStats.pendingClients} />
        <MetricCard icon={UserCheck} title="Total Signups" value={signupStats.totalSignups} trend={`${signupStats.growthPercentage}% growth`} />
        <MetricCard icon={AlertCircle} title="Total Pending Users" value={pendingStats.totalPendingUsers} />
        <MetricCard icon={DollarSign} title="Total Trainings" value={trainingStats.totalTrainings} />
        <MetricCard icon={BookOpen} title="Pending Trainings" value={trainingStats.pendingTrainings} />
      
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Signup Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User Signup Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
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
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contact Person</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Designation</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Phone Number</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Employees Number</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Contract Expiry</th>
                {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Active Users</th> */}
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {onboardingData.map((client) => (
                <tr key={client._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{client.company.companyDetails[0].companyName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.contactInformation[0].firstName} {client.contactInformation[0].lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.contactInformation[0].jobTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.contactInformation[0].email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.contactInformation[0].phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.company.companyDetails[0].numberOfEmployees}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(client.contractExpiry).toLocaleDateString()}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900"></td> */}
                  <td className="px-6 py-4 text-sm text-gray-600">{client.invoices[0]?.invoiceNumber || 'N/A'}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900">
                    {user.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td> */}
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
