import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { ClientDashboard } from '@/components/client/Dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/professional/ProfessionalDashboard';
import { InvestorDashboard } from '@/components/investor/InvestorDashboard';
import { MessagingCenter } from '@/components/messaging/MessagingCenter';
import { AdminDashboard } from '@/components/admin/dashboard/AdminDashboard';

const SuperAdminDashboard = () => <div><h1>Superadmin Dashboard</h1></div>;
const SettingsView = () => <div><h2>System Settings</h2></div>;

const routes = [
  { path: '', element: <SuperAdminDashboard /> },
  { path: 'dashboard', element: <SuperAdminDashboard /> },
  { path: 'admin', element: <AdminDashboard /> },
  { path: 'messages', element: <MessagingCenter recipientId="defaultRecipientId" /> },
  { path: 'investor', element: <InvestorDashboard /> },
  { path: 'students', element: <StudentDashboard /> },
  { path: 'clients', element: <ClientDashboard /> },
  { path: 'professionals', element: <ProfessionalDashboard /> },
  { path: 'settings', element: <SettingsView /> },
];

const SuperAdminPortal = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SuperAdmin Control Center</h1>
      <Routes>
        <Route index element={<SuperAdminDashboard />} />
        {routes.map(({ path, element }) => (
          path === '' ? null : <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/superadmin/dashboard" />} />
      </Routes>
    </div>
  );
};

export default SuperAdminPortal;