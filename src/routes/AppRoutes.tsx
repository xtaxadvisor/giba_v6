// src/routes/AppRoutes.tsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/Home';
import SameDayServicesPage from '../pages/services/SameDayServices';
const AdminPortal = React.lazy(() => import('../pages/admin/AdminPortal'));
const SuperAdminPortal = React.lazy(() => import('../pages/SuperAdminPortal'));
const ClientPortal = React.lazy(() => import('../pages/client/ClientPortal'));
const InvestorPortal = React.lazy(() => import('../pages/investor/InvestorPortal'));
const ProfessionalPortal = React.lazy(() => import('../pages/professional/ProfessionalPortal'));
const StudentPortal = React.lazy(() => import('../pages/student/StudentPortal'));
const MessagingPortal = React.lazy(() => import('../pages/messaging/MessagingPortal'));
import NotFoundPage from '../components/shared/NotFoundPage';
import ConversationView from '../components/messaging/ConversationView';
import ThankYou from '../pages/ThankYou';
import ServicesPage from '../pages/services/ServiceCatalog';
import VideoLibrary from '../pages/videos/VideoLibrary';
import { TaxCalculator } from '../components/calculator/TaxCalculator';
import TaxFormsPage from '../pages/forms/TaxForms';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import VideoDetail from '../pages/videos/VideoDetail';
import LoginPage from '../pages/LoginPage';
import Guest from '../pages/Guest/guest';
import Dashboard, { AdminDashboard, ProfessionalDashboard, StudentDashboard, ClientDashboard } from '../pages/Dashboard';
import { InvestorDashboard } from '../components/investor/InvestorDashboard';
import JenniferWidget from '@/components/ai/JenniferWidget';
import { useAuth } from '@/contexts/AuthContext';

export default function AppRoutes() {
  const { hydrated } = useAuth();

  useEffect(() => {
    console.log("✅ AppRoutes component is rendering");
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/same-day-services" element={<SameDayServicesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/courses" element={<VideoLibrary />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/tax-forms" element={<TaxFormsPage />} />
          <Route path="/thank-you" element={<ThankYou />} />

          <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminPortal /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/*" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminPortal /></ProtectedRoute>} />
          <Route path="/client/*" element={<ProtectedRoute allowedRoles={['client']}><ClientPortal /></ProtectedRoute>} />
          <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/investor/*" element={<ProtectedRoute allowedRoles={['investor']}><InvestorPortal /></ProtectedRoute>} />
          <Route path="/investor/dashboard" element={<ProtectedRoute allowedRoles={['investor']}><InvestorDashboard /></ProtectedRoute>} />
          <Route path="/videos/:videoId" element={<VideoDetail />} />
          <Route path="/messaging/*" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'client', 'investor', 'professional', 'student']}><MessagingPortal /></ProtectedRoute>} />
          <Route path="/messaging/:senderId" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ConversationView /></ProtectedRoute>} />
          <Route path="/professional/*" element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalPortal /></ProtectedRoute>} />
          <Route path="/professional/dashboard" element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalDashboard /></ProtectedRoute>} />
          <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentPortal /></ProtectedRoute>} />
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* ✅ Only render Jennifer when auth is hydrated */}
        {hydrated && <JenniferWidget />}
      </>
    </Suspense>
  );
}  