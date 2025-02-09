import { useState, useEffect, useRef } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  Search,
  ChevronDown,
  Download,
  Plus,
  Upload,
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
const availableCourses = [
  {
    id: 1,
    title: "POSH Training",
    category: "Compliance",
    duration: "2 hours",
    mandatory: true,
  },
  {
    id: 2,
    title: "Leadership Fundamentals",
    category: "Management",
    duration: "4 hours",
    mandatory: false,
  },
  {
    id: 3,
    title: "Cybersecurity Basics",
    category: "IT",
    duration: "3 hours",
    mandatory: true,
  },
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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [pending, setPending] = useState(0);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [pieData, setPieData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [trainingEngagementData, setTrainingEngagementData] = useState([]);

  const [employeeData, setEmployeeData] = useState<any[]>([]); // Update the state to hold employee data
  console.log(employeeData);

  const token = useSelector((state: any) => state.auth.token); // Get token from Redux store
  console.log("Token being used:", token);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(
          "https://gaussconnect/api/manager/employees/progress",
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
          "https://gaussconnect/api/manager/training-programs",
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
          "https://gaussconnect/api/manager/modules/total-status",
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
          "https://gaussconnect/api/manager/employees/details",
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
        "https://gaussconnect/api/manager/modules/categories/status",
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
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

  const handleEmployeeSelect = (id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleSendReminders = () => {
    console.log("Sending reminders to:", selectedEmployees);
    // Implement reminder functionality
  };

  const handleExportData = () => {
    console.log("Exporting data...");
    // Implement export functionality
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Process CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        // Parse CSV and process data
        console.log("Processing CSV:", text);
        setShowUploadModal(false);
      };
      reader.readAsText(file);
    }
  };

  const handleAssignTraining = () => {
    console.log("Assigning training:", {
      employees: selectedEmployees,
      courses: selectedCourses,
    });
    setShowAssignModal(false);
    setSelectedEmployees([]);
    setSelectedCourses([]);
  };

  const handleGenerateReport = () => {
    // Generate CSV report
    const csvContent =
      "Employee,Course,Status,Due Date\n" +
      employeeData
        .map((emp) => `${emp.name},${emp.title},${emp.status},${emp.dueDate}`)
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "training_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Training Management Dashboard
        </h1>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Employees
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Training
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
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
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Upload Employee Data
            </h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="block text-sm text-gray-600">
                    Click to upload CSV file
                  </span>
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Format: Employee ID, Name, Email, Department, Manager
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Training Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Assign Training
            </h3>
            <div className="space-y-6">
              {/* Employee Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employees
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {employeeData.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => {
                          setSelectedEmployees((prev) =>
                            prev.includes(employee.id)
                              ? prev.filter((id) => id !== employee.id)
                              : [...prev, employee.id]
                          );
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {employee.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({employee.department})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Courses
                </label>
                <div className="space-y-2">
                  {availableCourses.map((course) => (
                    <label
                      key={course.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => {
                          setSelectedCourses((prev) =>
                            prev.includes(course.id)
                              ? prev.filter((id) => id !== course.id)
                              : [...prev, course.id]
                          );
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">
                        {course.title}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({course.duration})
                      </span>
                      {course.mandatory && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                          Mandatory
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTraining}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={
                    selectedEmployees.length === 0 ||
                    selectedCourses.length === 0
                  }
                >
                  Assign Training
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
