import React, { useState, useEffect } from 'react';
import { Users, Clock, BookOpen, UserCheck, AlertCircle, DollarSign, Bell, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { login, getDashboardData, getTotalSignups, getCourseDistribution, getClientOnboardingDetails, getAllCourses, updateCourseStatus } from '../../utils/api.js'; // Import the utility functions
import { useNavigate } from 'react-router-dom';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionComment, setRejectionComment] = useState('');
  const [isApproving, setIsApproving] = useState(null); // Holds the approving courseId
  const [isRejecting, setIsRejecting] = useState(null); // Holds the rejecting courseId


  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await login();
        setToken(token);
        const data = await getDashboardData(token);
        const signups = await getTotalSignups(token);
        const courseData = await getCourseDistribution(token);
        const onboardingDetails = await getClientOnboardingDetails(token);
        const fetchApprovals = await getAllCourses(token)
        setDashboardData(data);
        setSignupsData(signups);
        const pending = await fetchApprovals;
        setCourseDistribution(courseData.distribution);
        console.log(onboardingData, "onboarding data")
        setOnboardingData(onboardingDetails);
        setPendingApprovals(pending);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  //  // Fetch Pending Approvals
  //  useEffect(() => {
  //   const fetchApprovals = async () => {
  //     try {
  //       const response = getAllCourses(token); // Update with actual API URL
  //       const data = await response;
  //       console.log(data,"pending approvals")
  //       setPendingApprovals(data);
  //     } catch (error) {
  //       console.error("Error fetching approvals:", error);
  //     }
  //   };

  //   fetchApprovals();
  // }, []);

  // Handle Approve
  const handleApprove = async (courseId) => {
    console.log(courseId, " courseId ");
    setIsApproving(courseId); // Start loading for this course
    try {
      const response = await updateCourseStatus(token, courseId, "published");
      console.log("Course status updated to published:", response);

      const fetchApprovals = await getAllCourses(token)
      setPendingApprovals(fetchApprovals);

      // Update state to remove the approved course from pendingApprovals
      // setPendingApprovals((prevApprovals) =>
      //   prevApprovals.filter((approval) => approval.id !== courseId)
      // );
    } catch (error) {
      console.error("Error updating course status:", error);
    } finally {
      setIsApproving(null); // Stop loading
    }
  };

  // Handle Reject
  // const handleReject = async (id) => {
  //   try {
  //     await fetch(`/api/approvals/${id}/reject`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ comment: rejectionComment }),
  //     });
  //     setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
  //     setSelectedApproval(null);
  //     setRejectionComment("");
  //   } catch (error) {
  //     console.error("Error rejecting course:", error);
  //   }
  // };
  const handleReject = async (courseId) => {
    console.log(courseId, " coutrseid ")
    setIsRejecting(courseId); // Start loading for this course

    try {
      const response = await updateCourseStatus(token, courseId, 'rejected');
      console.log('Course status updated to published:', response);

      setSelectedApproval(null)

      const fetchApprovals = await getAllCourses(token)
      setPendingApprovals(fetchApprovals);

      // Handle success (maybe update state or show a success message)
    } catch (error) {
      console.error('Error updating course status:', error);
      // Handle error (maybe show an error message)
    } finally {
      setIsRejecting(null); // Stop loading
    }
  };



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

  const notifications = [
    {
      id: 1,
      title: 'New Course Submitted',
      message: 'Advanced JavaScript Programming course needs your approval',
      type: 'approval',
      time: '2 hours ago',
      read: false,
      courseId: 1
    },
    {
      id: 2,
      title: 'Course Update',
      message: 'Leadership Fundamentals course has been modified',
      type: 'update',
      time: '4 hours ago',
      read: false
    },
    {
      id: 3,
      title: 'System Alert',
      message: 'Monthly training report is ready for review',
      type: 'alert',
      time: '1 day ago',
      read: true
    }
  ];
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

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => {
                      if (notification.type === 'approval') {
                        navigate(`/admin/courses/review/${notification.courseId}`);
                        setShowNotifications(false);
                      }
                    }}
                  >
                    <div className="flex items-start">
                      {notification.type === 'approval' && (
                        <Clock className="w-5 h-5 text-blue-500 mt-1" />
                      )}
                      {notification.type === 'update' && (
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
                      )}
                      {notification.type === 'alert' && (
                        <Bell className="w-5 h-5 text-red-500 mt-1" />
                      )}
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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

      {
        (pendingApprovals.filter((approval) => approval.status === "Pending Review")).length > 0 ?
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Course Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Instructor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Submitted Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingApprovals.filter((approval) => approval.status === "Pending Review").map((approval) => (
                    <tr key={approval.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900">{approval.courseTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{approval.instructor}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{approval.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{approval.submittedDate}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {approval.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Approve"
                            disabled={isApproving === approval.id}
                          >
                            {isApproving === approval.id ? (
                              <svg className="animate-spin h-5 w-5 text-green-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
                              </svg>
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                          </button>

                          <button
                            onClick={() => setSelectedApproval(approval)}
                            className="text-red-600 hover:text-red-700"
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            // onClick={() => navigate("/course-review")} 

                            onClick={() => navigate(`/course-review/${approval.id}`)}
                            className="text-blue-600 hover:text-blue-700"
                            title="View Details"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> : null
      }


      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Reject Course: {selectedApproval.title}
            </h3>
            {/* <textarea
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            /> */}
            <h2>Are you sure you want to reject the course?</h2>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate(`/course-review/${selectedApproval.id}`)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700"
                title="View Details"
              >
                Review Course
              </button>
              <button
                onClick={() => handleReject(selectedApproval.id)}
                className={`px-4 py-2 rounded-lg text-white transition ${isRejecting === selectedApproval.id ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                  }`}
                disabled={isRejecting === selectedApproval.id}
              >
                {isRejecting === selectedApproval.id ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"></path>
                    </svg>
                    Rejecting...
                  </div>
                ) : (
                  "Reject Course"
                )}
              </button>

            </div>
          </div>
        </div>
      )}

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
                  <td className="px-6 py-4 text-sm text-gray-900">{client.company?.companyDetails[0].companyName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.contactInformation[0].firstName} {client.contactInformation[0].lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.contactInformation[0].jobTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.contactInformation[0].email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.contactInformation[0].phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{client.company?.companyDetails[0].numberOfEmployees}</td>
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
