import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  GraduationCap,
  School,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    roles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    title: "HR Dashboard",
    icon: GraduationCap,
    path: "/hr",
    roles: ["MANAGER"],
  },
  {
    title: "Instructor",
    icon: School,
    path: "/instructor",
    roles: ["INSTRUCTOR"],
  },
  {
    title: "Employee",
    icon: School,
    path: "/employee",
    roles: ["EMPLOYEE"],
  },
  {
    title: "Clients",
    icon: Users,
    path: "/clients",
    roles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    title: "Courses",
    icon: BookOpen,
    path: "/courses/create",
    roles: ["SUPER_ADMIN", "INSTRUCTOR"],
  },
  {
    title: "Schedule",
    icon: Calendar,
    path: "/schedule",
    roles: ["SUPER_ADMIN", "HR", "INSTRUCTOR"],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
    roles: ["SUPER_ADMIN"],
  },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const signout = useAuthStore((state) => state.signout);
  const user = useAuthStore((state) => state.user);

  const handleLogout = () => {
    // Clear auth state from the store
    signout();

    // Close the user menu
    setUserMenuOpen(false);

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static flex-shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <span className="text-xl font-semibold text-gray-800">L&D Admin</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* User Menu */}
          <div className="relative ml-auto">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.username || "Guest User"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
