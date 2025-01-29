import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import HRDashboard from './components/admin/HRDashboard';
import InstructorDashboard from './components/admin/InstructorDashboard';
import EmployeeDashboard from './components/admin/EmployeeDashboard';
import OnboardingForm from './components/OnboardingForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingForm />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hr" element={<HRDashboard />} />
          <Route path="instructor" element={<InstructorDashboard />} />
          <Route path="employee" element={<EmployeeDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;