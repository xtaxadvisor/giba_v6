import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AdminProtectedRoute } from '../components/admin/auth/AdminProtectedRoute';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminLoginForm } from '../components/admin/auth/AdminLoginForm';
import { TeamManagement } from '../components/admin/team/TeamManagement';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

function AdminShell() {
  return (
    <AdminLayout>
      <Breadcrumbs />
      <Outlet />
    </AdminLayout>
  );
}
const AIMonitoringDashboard = React.lazy(() => import('../pages/admin/AIMonitoringDashboard'));

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginForm />} />
      <Route
        path=""
        element={
          <AdminProtectedRoute>
            <AdminShell />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="team" element={<TeamManagement />} />
        <Route path="ai-monitor" element={<AIMonitoringDashboard />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}