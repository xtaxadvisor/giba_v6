import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import NotFoundPage from '../components/shared/NotFoundPage';
import { investorvideos } from '@/components/investor/VideoLibrary';
import type { VideoLibraryProps } from '@/components/investor/VideoLibrary';

// Lazy load portal components
const AdminPortal = React.lazy(() => import('../pages/admin/AdminPortal'));
const InvestorPortal = React.lazy(() =>
  import('../pages/investor/InvestorPortal').then(module => ({ default: module.default }))
);
const InvestorForum = React.lazy(() =>
  import('../pages/investor/InvestorForum').then(module => ({ default: module.default }))
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



interface InvestorPortalProps {
  videos: { id: number; title: string; url: string }[];
}

const InvestorPortalComponent: React.FC<InvestorPortalProps> = ({ videos }) => {
  return (
    <div>
      <h1>Investor Portal</h1>
      <ul>
        {videos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
};

export { InvestorPortalComponent };
export function PortalRoutes() {
  return (
    <Routes>
      {/* Default root: redirect to client portal */}
      <Route index element={<Navigate to="/client" replace />} />
      
      <Route
        path="/admin/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Admin Portal...</h2>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<AdminPortal />} />
              </Routes>
            </section>
          </React.Suspense>
        }
      />
      
      <Route
        path="/investor/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Investor Portal...</h2>
              <InvestorPortalComponent videos={investorvideos} /> 
            </section>
          </React.Suspense>
        }
      />
      <Route
        path="/videos"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Video Library...</h2>
              <VideoLibrary />
            </section>
          </React.Suspense>
        } 
      />
      <Route
        path="/videos/:videoId"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Video Detail...</h2>
              <VideoDetail />
            </section>
          </React.Suspense>
        } 
      />

      <Route
        path="/student/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Student Portal...</h2>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<StudentPortal />} />
              </Routes>
            </section>
          </React.Suspense>
        }
      />

      <Route
        path="/professional/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Professional Portal...</h2>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<ProfessionalPortal />} />
              </Routes>
            </section>
          </React.Suspense>
        }
      />
      <Route
        path="/client/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Client Portal...</h2>
              <Routes>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<ClientPortal />} />
              </Routes>
            </section>
          </React.Suspense>
        }
      />
      <Route
        path="/messaging/*"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Messaging Portal...</h2>
              <MessagingPortal />
            </section>
          </React.Suspense>
        }
      />
      <Route
        path="/browse-videos"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Video Library...</h2>
              <VideoLibrary />
            </section>
          </React.Suspense>
        }
      />
      <Route
        path="/browse-videos/:videoId"
        element={
          <React.Suspense fallback={<LoadingSpinner />}>
            <section className="p-6 text-center">
              <h2 className="text-lg font-bold text-gray-700">Loading Video Detail...</h2>
              <VideoDetail />
            </section>
          </React.Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default PortalRoutes;