import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { AdminDashboard } from '../../components/admin/dashboard/superadmin/dashboard';
import { TeamManagement } from '../../components/admin/team/TeamManagement';
import { UserManagement } from '../../components/admin/users/UserManagement';
import { AdminSettings } from '../../components/admin/settings/AdminSettings';
import { NotFoundPage } from '../../components/shared/NotFoundPage';
import { AdminProtectedRoute } from '../../components/admin/auth/AdminProtectedRoute';
import MessagingInbox from '../messaging/MessagingInbox';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

export default function AdminPortal() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <Breadcrumb fontWeight="medium" fontSize="sm" mb={4}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          {pathParts.map((part, idx) => {
            const path = '/' + pathParts.slice(0, idx + 1).join('/');
            const isLast = idx === pathParts.length - 1;
            return (
              <BreadcrumbItem key={path} isCurrentPage={isLast}>
                <BreadcrumbLink href={path}>{part}</BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="messages" element={<MessagingInbox />} />
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="404" replace />} />
        </Routes>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}