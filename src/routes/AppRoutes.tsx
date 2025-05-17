import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
const AdminPortal = React.lazy(() => import('../pages/admin/AdminPortal'));
const SuperAdminPortal = React.lazy(() => import('../pages/SuperAdminPortal'));
const ClientPortal = React.lazy(() => import('../pages/client/ClientPortal'));
const InvestorPortal = React.lazy(() => import('../pages/investor/InvestorPortal'));
const ProfessionalPortal = React.lazy(() => import('../pages/professional/ProfessionalPortal'));
const StudentPortal = React.lazy(() => import('../pages/student/StudentPortal'));
const MessagingPortal = React.lazy(() => import('../pages/messaging/MessagingPortal'));
import NotFoundPage from '../components/shared/NotFoundPage';
import { investorvideos, VideoLibrary } from '@/components/investor/VideoLibrary';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import VideoDetail from '@/pages/videos/VideoDetail';
import LoginPage from '../pages/LoginPage';

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPortal />} />
        <Route path="/superadmin/*" element={<SuperAdminPortal />} />
        <Route path="/client/*" element={<ClientPortal />} />
        <Route path="/investor/*" element={<InvestorPortal />} />
        <Route path="/videos" element={<VideoLibrary videos={investorvideos} />} />
        <Route path="/videos/:videoId" element={<VideoDetail />} />
        <Route path="/messaging/*" element={<MessagingPortal />} />
        <Route path="/professional/*" element={<ProfessionalPortal />} />
        <Route path="/student/*" element={<StudentPortal />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}