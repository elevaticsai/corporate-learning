import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  GraduationCap,
  School,
  LogOut,
  X,
  User,
  Moon,
  Sun,
  UserPlus,
  CreditCard,
  Presentation,
} from "lucide-react";

import { useTheme } from "../contexts/ThemeContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    roles: ["SUPER_ADMIN"],
  },
  {
    title: "Dashboard",
    icon: GraduationCap,
    path: "/hr",
    roles: ["MANAGER"],
  },
  {
    title: "Manage Users",
    icon: UserPlus,
    path: "/hr/user-management",
    roles: ["MANAGER"],
  },
  {
    title: "Upgrade Credits",
    icon: CreditCard,
    path: "/signup",
    roles: ["MANAGER"],
  },
  {
    title: "Instructor",
    icon: School,
    path: "/instructor",
    roles: ["INSTRUCTOR"],
  },
  {
    title: "Home",
    icon: School,
    path: "/employee",
    roles: ["EMPLOYEE"],
  },
  {
    title: "Create Courses",
    icon: BookOpen,
    path: "/courses/create",
    roles: ["SUPER_ADMIN", "INSTRUCTOR"],
  },
  {
    title: "Create Presentation",
    icon: Presentation,
    path: "/presentation/create",
    roles: ["SUPER_ADMIN", "INSTRUCTOR"],
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
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handlePresentationMode = () => {
      const isPresentationMode = sessionStorage.getItem("presentationMode") === "true";
      setSidebarOpen(!isPresentationMode);
    };

    handlePresentationMode();

    const customEventName = "presentationModeChange";
    window.addEventListener(customEventName, handlePresentationMode);

    return () => {
      window.removeEventListener(customEventName, handlePresentationMode);
    };
  }, []);

  const handleLogout = () => {
    signout();
    setUserMenuOpen(false);
    navigate("/");
  };
  const user = useSelector((state: any) => state.auth.user);
  const userRole = user?.role || "GUEST";

  return (
    <div className="flex bg-gray-60 dark:bg-dark-900 min-h-screen">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen && sessionStorage.getItem("presentationMode") !== "true" ? "translate-x-0" : "-translate-x-full"
        } lg:${sessionStorage.getItem("presentationMode") === "true" ? "-translate-x-full" : "translate-x-0"} lg:static flex-shrink-0 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-dark-700">
          <span className="text-xl font-semibold text-gray-800 dark:text-white">
            Elevatics360
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  className={({ isActive }) => {
                    return `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                    }`;
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.title}
                </NavLink>
              );
            })}
        </nav>

        <div className="border-t border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username || "Guest User"}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <main className="p-4 lg:p-8 dark:bg-dark-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
