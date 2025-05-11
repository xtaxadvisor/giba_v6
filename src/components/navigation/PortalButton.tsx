import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/Home';
import ClientPortal from '../../pages/client/ClientPortal';
import AdminPortal from '../../pages/admin/AdminPortal';
import InvestorPortal from '../../pages/InvestorPortal';
import StudentPortal from '../../pages/student/StudentPortal';
import ProfessionalPage from '../../pages/professional/ProfessionalPortal';
import AccessDenied from '../../pages/accessDenied';

// Assume user is available via context or props.
// For this patch, we'll use a placeholder for demonstration.
// Replace this with your actual user retrieval logic (e.g., useContext(AuthContext))
const user = JSON.parse(localStorage.getItem('user') || 'null');

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route
        path="/client"
        element={
          user?.role === 'client'
            ? <ClientPortal />
            : <Navigate to="/register" replace />
        }
      />
      <Route
        path="/admin"
        element={
          user?.role === 'admin'
            ? <AdminPortal />
            : <Navigate to="/access-denied" replace />
        }
      />
      <Route
        path="/investor"
        element={
          user?.role === 'investor'
            ? <InvestorPortal />
            : <Navigate to="/register" replace />
        }
      />
      <Route
        path="/student"
        element={
          user?.role === 'student'
            ? <StudentPortal />
            : <Navigate to="/register" replace />
        }
      />
      <Route
        path="/professional"
        element={
          user?.role === 'professional'
            ? <ProfessionalPage />
            : <Navigate to="/access-denied" replace />
        }
      />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
};

export default AppRoutes;