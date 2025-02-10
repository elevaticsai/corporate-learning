import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  Search,
  ChevronDown,
  UserPlus,
} from "lucide-react";
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
  Cell,
} from "recharts";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

interface EmployeeType {
  name: string;
  email: string;
  modules: ModuleType[];
}
interface ModuleType {
  title: string;
  category: string;
  status: string;
  progress: string;
}

const departments = [
  "All Departments",
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
];
const trainingTypes = [
  "All Types",
  "Technical Skills",
  "Soft Skills",
  "Compliance",
  "Leadership",
];

const MetricCard = ({
  icon: Icon,
  title,
  value,
  trend,
}: {
  icon: any;
  title: string;
  value: string;
  trend?: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      {trend && (
        <span
          className={`text-sm ${
            trend.startsWith("+") ? "text-green-500" : "text-red-500"
          }`}
        >
          {trend}
        </span>
      )}
    </div>
    <h3 className="mt-4 text-gray-600 text-sm font-medium">{title}</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

const HRDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [trainingCount, setTrainingCount] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const [pieData, setPieData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [trainingEngagementData, setTrainingEngagementData] = useState([]);

  const [employeeData, setEmployeeData] = useState<any[]>([]); // Update the state to hold employee data
  console.log(employeeData);

  const token = useSelector((state: any) => state.auth.token); // Get token from Redux store

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/manager/employees/progress",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401)
          throw new Error("Unauthorized: Invalid Token");

        const data = await response.json();

        if (Array.isArray(data)) {
          setTotalEmployees(data.length);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    const fetchTrainingData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/manager/training-programs",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401)
          throw new Error("Unauthorized: Invalid Token");

        const data = await response.json();
        setTrainingCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching training data:", error);
      }
    };

    const fetchModuleStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/manager/modules/total-status",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401)
          throw new Error("Unauthorized: Invalid Token");

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const statusMap = new Map<string, number>();

          // Loop through data to populate the map
          data.data.forEach((item: { name: string; value: number }) => {
            statusMap.set(item.name, item.value);
          });

          setCompleted(statusMap.get("Completed") ?? 0);
          setPending(statusMap.get("Pending") ?? 0);
          // setOverdue(statusMap.get("Overdue") ?? 0);
          setPieData([
            {
              name: "Completed",
              value: statusMap.get("Completed") ?? 0,
              color: "#10B981",
            },
            {
              name: "Pending",
              value: statusMap.get("Pending") ?? 0,
              color: "#F59E0B",
            },
          ]);
        } else {
          console.error("Invalid response structure", data);
        }
      } catch (error) {
        console.error("Error fetching module status:", error);
      }
    };

    fetchEmployeeData();
    fetchTrainingData();
    fetchModuleStatus();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/manager/employees/details",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          // Flatten employee data by creating a row per module
          const formattedData = data.data.flatMap((employee: EmployeeType) =>
            employee.modules.map((module: ModuleType) => ({
              name: employee.name,
              email: employee.email,
              title: module.title,
              category: module.category,
              status: module.status,
              progress: module.progress,
            }))
          );

          setEmployeeData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  const fetchTrainingEngagement = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/manager/modules/categories/status",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401)
        throw new Error("Unauthorized: Invalid Token");

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setTrainingEngagementData(data.data);
      } else {
        console.error("Invalid response structure", data);
      }
    } catch (error) {
      console.error("Error fetching training engagement data:", error);
    }
  };

  useEffect(() => {
    fetchTrainingEngagement();
  }, []);

  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedType, setSelectedType] = useState("All Types");
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  // const handleEmployeeSelect = (id: number) => {
  //   setSelectedEmployees((prev) =>
  //     prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
  //   );
  // };

  // const handleSendReminders = () => {
  //   console.log("Sending reminders to:", selectedEmployees);
  //   // Implement reminder functionality
  // };

  // const handleExportData = () => {
  //   console.log("Exporting data...");
  //   // Implement export functionality
  // };

  return (
    <div className="space-y-6 pl-5">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">HR Dashboard</h1>
        <Link
          to="/hr/user-management"
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <UserPlus size={20} /> Manage Users
        </Link>
      </div>

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
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
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
            {trainingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Users}
          title="Total Employees"
          value={totalEmployees.toString()}
        />
        {/* <MetricCard
          icon={GraduationCap}
          title="Active Trainings"
          value="48"
          trend="+5 this week"
        /> */}
        <MetricCard
          icon={Users}
          title="Total Training Programs"
          value={trainingCount.toString()}
        />
        <MetricCard
          icon={CheckCircle}
          title="Completed Trainings"
          value={completed.toString()}
        />
        <MetricCard
          icon={Clock}
          title="Pending Trainings"
          value={pending.toString()}
        />
        {/* <MetricCard
          icon={AlertCircle}
          title="Overdue Trainings"
          value={overdue.toString()}
        /> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training Engagement Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Training Engagement
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trainingEngagementData}
                barGap={2} // Adjusting the gap between bars
                barCategoryGap={0} // Adjusting the spacing between groups of bars
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#10B981"
                  stroke="none"
                  barSize={50} // Adjust the width of the bars
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#F59E0B"
                  stroke="none"
                  barSize={20} // Adjust the width of the bars
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Training Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Training Status Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
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
          <h3 className="text-lg font-medium text-gray-900">
            Employee Training Status
          </h3>
          {/* <div className="flex gap-4">
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
          </div> */}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Employee Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Module
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employeeData.map((employee, idx) => (
                <tr key={idx}>
                  {/* <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                      onChange={() => handleEmployeeSelect(employee.id)} // Add checkbox functionality
                    />
                  </td> */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {employee.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {employee.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {employee.category}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      employee.status === "pending"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {employee.status}
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

export default HRDashboard;
