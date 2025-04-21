import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import NotFoundPage from '../components/shared/NotFoundPage';
import { investorvideos } from '@/components/investor/VideoLibrary';
import type { VideoLibraryProps } from '@/components/investor/VideoLibrary';

// Lazy load portal components
const AdminPortal = React.lazy(() => import('../pages/admin/AdminPortal'));
const InvestorPortal = React.lazy<React.FC<VideoLibraryProps>>(
  // Use React.FC<VideoLibraryProps> to specify the expected props type for InvestorPortal  
  () => import('../pages/investor/InvestorPortal')
);
const InvestorForum = React.lazy(
  // Use React.FC<VideoLibraryProps> to specify the expected props type for InvestorPortal    
  () => import('../pages/investor/InvestorForum')
  );
const InvestorDashboard = React.lazy(
  // Use React.FC<VideoLibraryProps> to specify the expected props type for InvestorPortal
  () => import('../components/investor/InvestorDashboard').then(module => ({ default: module.InvestorDashboard }))
);
const InvestorLayout = React.lazy(  
  // Use React.FC<VideoLibraryProps> to specify the expected props type for InvestorPortal  
  () => import('../components/investor/InvestorLayout')
);

const StudentPortal = React.lazy(() => import('../pages/student/StudentPortal'));
const ProfessionalPortal = React.lazy(() => import('../pages/professional/ProfessionalPortal'));
const ClientPortal = React.lazy(() => import('../pages/client/ClientPortal'));
const MessagingPortal = React.lazy(() => import('../pages/messaging/MessagingPortal'));
const VideoLibrary = React.lazy(() => import('../pages/videos/VideoLibrary'));
const VideoDetail = React.lazy(() => import('../pages/videos/VideoDetail'));

export function PortalRoutes() {
  return (
    <Routes>
      {/* Default root: redirect to client portal */}
      <Route index element={<Navigate to="/client" replace />} />
      
      <Route
        path="/admin/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <AdminPortal />
          </React.Suspense>
        }
      />
      
      <Route
        path="/investor/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <InvestorPortal videos={investorvideos} /> 
            </React.Suspense>
        }
      />
      <Route
        path="/videos"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <VideoLibrary />
          </React.Suspense>
        } 
      />
      <Route
        path="/videos/:videoId"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <VideoDetail />
          </React.Suspense>
        } 
      />

      <Route
        path="/student/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <StudentPortal />
          </React.Suspense>
        }
      />

      <Route
        path="/professional/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <ProfessionalPortal />
          </React.Suspense>
        }
      />
      <Route
        path="/client/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <ClientPortal />
          </React.Suspense>
        }
      />
      <Route
        path="/messaging/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <MessagingPortal />
          </React.Suspense>
        }
      />
      <Route
        path="/browse-videos"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <VideoLibrary />
          </React.Suspense>
        }
      />
      <Route
        path="/browse-videos/:videoId"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <VideoDetail />
          </React.Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default PortalRoutes;