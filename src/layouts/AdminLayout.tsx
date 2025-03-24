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
  CheckCircle,
  Clock,
  Home,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
    roles: ["SUPER_ADMIN"],
  },
  { title: "Dashboard", icon: GraduationCap, path: "/hr", roles: ["MANAGER"] },
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
  { title: "Home", icon: Home, path: "/employee", roles: ["EMPLOYEE"] },
  {
    title: "Completed Courses",
    icon: CheckCircle,
    path: "/completed-courses",
    roles: ["EMPLOYEE"],
  },
  {
    title: "Pending Courses",
    icon: Clock,
    path: "/pending-courses",
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const navigate = useNavigate();
  const signout = useAuthStore((state) => state.signout);
  const { theme, toggleTheme } = useTheme();
  const user = useSelector((state: any) => state.auth.user);
  const userRole = user?.role || "GUEST";

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const handleMouseEnter = () => {
    if (!sidebarExpanded) {
      setSidebarHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!sidebarExpanded) {
      setSidebarHovered(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={sidebarExpanded || sidebarHovered}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: sidebarExpanded || sidebarHovered ? "20%" : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarExpanded || sidebarHovered ? "20%" : 80,
            boxSizing: "border-box",
            // transition: "width 0.1s ease-in-out",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar>
          {(sidebarExpanded || sidebarHovered) && (
            <Typography variant="h6" noWrap component="div">
              Elevatics360
            </Typography>
          )}
        </Toolbar>
        <Divider />
        <List
          sx={{ flexGrow: 1, fontFamily: "Your Font Family, ui-sans-serif" }}
        >
          {menuItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              return (
                <ListItem
                  button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    fontFamily: "ui-sans-serif",
                    borderRadius: 2,
                    "&.active": {
                      bgcolor: "primary.light",
                      color: "primary.main",
                    },
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, py: 1 }}>
                    <Icon size={20} />
                  </ListItemIcon>
                  {(sidebarExpanded || sidebarHovered) && (
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: 1,
                        fontFamily: " ui-sans-serif, system-ui",
                      }}
                    />
                  )}
                </ListItem>
              );
            })}
        </List>
        <Box sx={{ mt: "auto" }}>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "grey.300",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={20} />
              </Box>
              {(sidebarExpanded || sidebarHovered) && (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    {user?.username || "Guest User"}
                  </Typography>
                  <IconButton
                    onClick={toggleTheme}
                    sx={{ color: "text.primary" }}
                  >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  </IconButton>
                </Box>
              )}
            </Box>
            {!(sidebarExpanded || sidebarHovered) && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <IconButton
                  onClick={toggleTheme}
                  sx={{ color: "text.primary" }}
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </IconButton>
                <IconButton onClick={signout} sx={{ color: "text.primary" }}>
                  <LogOut size={20} />
                </IconButton>
              </Box>
            )}
            {(sidebarExpanded || sidebarHovered) && (
              <Box sx={{ mt: 2 }}>
                <IconButton onClick={signout} sx={{ color: "text.primary" }}>
                  <LogOut size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Sign out
                  </Typography>
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
