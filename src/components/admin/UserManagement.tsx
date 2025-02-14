import { useState, useEffect, useRef } from "react";
import { Upload, Plus, Trash2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignModuleModal from "./AssignModuleModal";
import api, { configureApi } from "../../api/api";

interface Module {
  title: string;
  category: string;
  status: string;
  progress: number;
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  modules: Module[];
}

interface APIResponse {
  success: boolean;
  data: Employee[];
}

interface AddEmployeeResponse {
  message: string;
  employee: Employee;
}

interface BulkUploadResponse {
  message: string;
  totalProcessed: number;
  added: number;
  skipped: number;
  createdEmployees: {
    email: string;
    username: string;
    _id: string;
  }[];
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeEmail: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  employeeEmail,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 z-50 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Confirm Delete
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete the employee with email{" "}
            <span className="font-medium">{employeeEmail}</span>?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

const UserManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employeeId: "",
    employeeEmail: "",
  });
  const [assignModuleModal, setAssignModuleModal] = useState({
    isOpen: false,
    employeeEmail: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get auth token from Redux store
  const token = useSelector((state: any) => state.auth?.token);

  useEffect(() => {
    if (token) {
      configureApi(token);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchEmployees();
    } else {
      setError("Authentication required");
    }
  }, [token]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<APIResponse>(
        "/api/manager/employees/details"
      );
      console.log("Fetched employees data:", response.data.data);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        setEmployees(response.data.data);
      } else {
        console.error("Invalid response format:", response.data);
        setError("Invalid response format from server");
        setEmployees([]);
      }
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      setError(error.response?.data?.message || "Failed to fetch employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post<AddEmployeeResponse>(
        "/api/manager/employees",
        newEmployee
      );
      setNewEmployee({ username: "", email: "" });

      // Debug logs
      console.log("Add employee response:", response.data);
      console.log("Showing success toast with message:", response.data.message);

      // Show success message
      toast.success(response.data.message);

      fetchEmployees();
    } catch (error: any) {
      console.error("Error adding employee:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to add employee";
      console.log("Showing error toast with message:", errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      setLoading(true);
      const response = await api.post<BulkUploadResponse>(
        "/api/manager/employees/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success message
      toast.success(response.data.message);

      setCsvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchEmployees();
    } catch (error: any) {
      console.error("Error uploading CSV:", error);
      const errorMsg = error.response?.data?.message || "Failed to upload CSV";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignModule = async (email: string) => {
    setAssignModuleModal({
      isOpen: true,
      employeeEmail: email,
    });
  };

  const handleAssignModules = async (moduleIds: string[]) => {
    try {
      await api.post(`/api/manager/assign-modules`, {
        email: assignModuleModal.employeeEmail,
        moduleIds,
      });
      toast.success("Modules assigned successfully");
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error("Error assigning modules:", error);
      toast.error("Failed to assign modules");
    }
  };

  const handleDeleteEmployee = async (employeeId: string, email: string) => {
    console.log("Attempting to delete employee:", { employeeId, email });

    if (!employeeId) {
      console.error("Employee ID is undefined");
      toast.error("Cannot delete employee: Invalid ID");
      return;
    }

    try {
      setLoading(true);
      console.log("Making delete request for employee ID:", employeeId);
      await api.delete(`/api/manager/employees/${employeeId}`);
      toast.success("Employee deleted successfully");
      setDeleteModal({ isOpen: false, employeeId: "", employeeEmail: "" });
      fetchEmployees();
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to delete employee";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pl-5">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        User Management
      </h1>

      {/* Add Employee Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 dark:bg-dark-800 dark:border-dark-700">
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={newEmployee.username}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, username: e.target.value })
              }
              className="border rounded-md p-2 dark:border-dark-700 dark:bg-dark-700"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
              className="border rounded-md p-2 dark:border-dark-700 dark:bg-dark-700"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} /> Add Employee
          </button>
        </form>
      </div>

      {/* CSV Upload */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 dark:bg-dark-800 dark:border-dark-700">
        <h2 className="text-xl font-semibold mb-4">Bulk Upload</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="border rounded-md p-2 dark:border-dark-700 dark:bg-dark-700"
          />
          <button
            onClick={handleBulkUpload}
            disabled={!csvFile || loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
          >
            <Upload size={20} /> Upload CSV
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, employeeId: "", employeeEmail: "" })
        }
        onConfirm={() =>
          handleDeleteEmployee(
            deleteModal.employeeId,
            deleteModal.employeeEmail
          )
        }
        employeeEmail={deleteModal.employeeEmail}
      />

      {/* Assign Module Modal */}
      <AssignModuleModal
        isOpen={assignModuleModal.isOpen}
        onClose={() =>
          setAssignModuleModal({ isOpen: false, employeeEmail: "" })
        }
        employeeEmail={assignModuleModal.employeeEmail}
        onAssign={handleAssignModules}
      />

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-dark-800">
        {error && (
          <div className="p-4 text-red-600 bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : (
          <>
            <table className="min-w-full dark:bg-dark-800">
              <thead className="bg-gray-50 dark:bg-dark-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:bg-dark-800 divide-gray-200">
                {Array.isArray(employees) && employees.length > 0 ? (
                  employees
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((employee) => {
                      console.log("Rendering employee:", employee);
                      return (
                        <tr key={employee.email}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {employee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {employee.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {Array.isArray(employee.modules) &&
                              employee.modules.length > 0 ? (
                                employee.modules.map((module, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      module.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : module.status === "in_progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {module.title}: {module.status}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 text-sm">
                                  No modules assigned
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-5">
                              <button
                                onClick={() =>
                                  handleAssignModule(employee.email)
                                }
                                className="text-blue-600 hover:text-blue-900 text-sm"
                              >
                                Assign Modules
                              </button>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Delete button clicked for employee:",
                                    employee
                                  );
                                  setDeleteModal({
                                    isOpen: true,
                                    employeeId: employee._id,
                                    employeeEmail: employee.email,
                                  });
                                }}
                                className="text-red-600 hover:text-red-900 inline-flex items-center"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {Array.isArray(employees) && employees.length > itemsPerPage && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of{" "}
                    {Math.ceil(employees.length / itemsPerPage)}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(employees.length / itemsPerPage)
                        )
                      )
                    }
                    disabled={
                      currentPage === Math.ceil(employees.length / itemsPerPage)
                    }
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
