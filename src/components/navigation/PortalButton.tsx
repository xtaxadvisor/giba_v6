import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/Home'; // Update the path to match the correct file location
import ClientPage from '../../pages/client/ClientPortal';
import AdminPage from '../../pages/admin/AdminPortal';
import InvestorPortal from '../../pages/InvestorPortal';
import StudentPortal from '../../pages/student/StudentPortal';
import ProfessionalPage from '../../pages/professional/ProfessionalPortal';

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/client" element={<ClientPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/investor" element={<InvestorPortal />} />
      <Route path="/student" element={<StudentPortal />} />
      <Route path="/professional" element={<ProfessionalPage />} />
      <Route path="*" element={<Navigate to="/client" replace />} />
    </Routes>
  );
};

export default AppRoutes;