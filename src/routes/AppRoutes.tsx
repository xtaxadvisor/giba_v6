import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPortal from '../pages/admin/AdminPortal';
import ClientPortal from '../pages/client/ClientPortal';
import InvestorPortal from '../pages/investor/InvestorPortal';
import ProfessionalPortal from '../pages/professional/ProfessionalPortal';
import StudentPortal from '../pages/student/StudentPortal';
import NotFoundPage from '../components/shared/NotFoundPage';
import { investorvideos, VideoLibrary } from '@/components/investor/VideoLibrary';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import VideoDetail from '@/pages/videos/VideoDetail';
import MessagingPortal from '../pages/messaging/MessagingPortal';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/client" replace />} />
      <Route path="/admin/*" element={<AdminPortal />} />
      <Route path="/client/*" element={<ClientPortal />} />
      <Route path="/investor/*" element={<InvestorPortal />} />
      <Route path="/videos" element={<VideoLibrary videos={investorvideos} />} />
      <Route path="/videos/:videoId" element={<VideoDetail />} />
      <Route path="/messaging/*" element={<MessagingPortal />} />
      
      <Route path="/professional/*" element={<ProfessionalPortal />} />
      <Route path="/student/*" element={<StudentPortal />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}