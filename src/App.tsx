import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/admin/Dashboard";
import HRDashboard from "./components/admin/HRDashboard";
import InstructorDashboard from "./components/admin/InstructorDashboard";
import EmployeeDashboard from "./components/admin/EmployeeDashboard";
import TrainingDetails from "./components/training/TrainingDetails";
import OnboardingForm from "./components/OnboardingForm";
import LoginPage from "./components/auth/LoginPage";
import CreateCourse from "./components/course/CreateCourse";
import CourseReview from "./components/course/CourseReview";
import UserManagement from "./components/admin/UserManagement";
import ResetPassword from "./components/auth/ResetPassword";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<OnboardingForm />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/" element={<AdminLayout />}>
            <Route path="hr" element={<HRDashboard />} />
            <Route path="hr/user-management" element={<UserManagement />} />
            <Route path="employee" element={<EmployeeDashboard />} />
            <Route path="instructor" element={<InstructorDashboard />} />
            <Route path="training/:id" element={<TrainingDetails />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="courses/edit/:courseId" element={<CreateCourse />} />
            <Route path="course-review/:id" element={<CourseReview />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
