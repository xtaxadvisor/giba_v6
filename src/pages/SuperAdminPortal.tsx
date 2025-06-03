// src/pages/SuperAdminPortal.tsx
import React from 'react';
import { NavLink, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { ClientDashboard } from '@/components/client/Dashboard/ClientDashboard';
import ProfessionalDashboard from '@/components/professional/ProfessionalDashboard';
import { InvestorDashboard } from '@/components/investor/InvestorDashboard';
import { MessagingCenter } from '@/components/messaging/MessagingCenter';
import { AdminDashboard } from '@/components/admin/dashboard/AdminDashboard';
import RoleManagement from '@/components/admin/roles/RoleManagement';

const SuperAdminDashboard = () => <div><h1>SuperAdmin Dashboard</h1></div>;
const SettingsView = () => <div><h2>System Settings</h2></div>;

const routes = [
  { path: '', label: 'Dashboard', element: <SuperAdminDashboard /> },
  { path: 'dashboard', label: 'Dashboard', element: <SuperAdminDashboard /> },
  { path: 'admin', label: 'Admin', element: <AdminDashboard /> },
  { path: 'messages', label: 'Messages', element: <MessagingCenter recipientId="defaultRecipientId" /> },
  { path: 'investor', label: 'Investors', element: <InvestorDashboard /> },
  { path: 'students', label: 'Students', element: <StudentDashboard /> },
  { path: 'clients', label: 'Clients', element: <ClientDashboard /> },
  { path: 'professionals', label: 'Professionals', element: <ProfessionalDashboard /> },
  { path: 'settings', label: 'Settings', element: <SettingsView /> },
  { path: 'roles', label: 'Roles', element: <RoleManagement /> },
];

const SuperAdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">SuperAdmin</h2>
        <nav className="flex flex-col space-y-2">
          {routes.map(({ path, label }) => (
            <NavLink
              key={path || 'index'}
              to={`/superadmin/${path}`.replace('//', '/')}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

const SuperAdminPortal = () => {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        {routes.map(({ path, element }) => (
          <Route
            key={path || 'index'}
            index={path === ''}
            path={path}
            element={element}
          />
        ))}
        <Route path="*" element={<Navigate to="/superadmin/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminPortal;