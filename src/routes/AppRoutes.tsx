// src/routes/AppRoutes.tsx
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterPage from '@/pages/RegisterPage';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';
import HomePage from '../pages/Home';
import SameDayServicesPage from '../pages/services/SameDayServices';
import NotFoundPage from '../components/shared/NotFoundPage';
import ConversationView from '../components/messaging/ConversationView';
import ThankYou from '../pages/ThankYou';
import ServicesPage from '../pages/services/ServiceCatalog';
import VideoLibrary from '../pages/videos/VideoLibrary';
import { TaxCalculator } from '../components/calculator/TaxCalculator';
import TaxFormsPage from '../pages/forms/TaxForms';
import VideoDetail from '../pages/videos/VideoDetail';
import LoginPage from '../pages/LoginPage';
import Guest from '../pages/Guest/guest';
import Dashboard, {
  AdminDashboard,
  ProfessionalDashboard,
  StudentDashboard,
  ClientDashboard
} from '../pages/Dashboard';
import { InvestorDashboard } from '../components/investor/InvestorDashboard';
import JenniferWidget from '@/components/ai/JenniferWidget';
import { useAuth } from '@/contexts/AuthContext';
import AuthCallback from '@/pages/AuthCallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// ✅ Lazy loaded portals
const AdminPortal = React.lazy(() => import('../pages/admin/AdminPortal'));
const SuperAdminPortal = React.lazy(() => import('../pages/SuperAdminPortal'));
const ClientPortal = React.lazy(() => import('../pages/client/ClientPortal'));
const InvestorPortal = React.lazy(() => import('../pages/investor/InvestorPortal'));
const ProfessionalPortal = React.lazy(() => import('../pages/professional/ProfessionalPortal'));
const StudentPortal = React.lazy(() => import('../pages/student/StudentPortal'));
const MessagingPortal = React.lazy(() => import('../pages/messaging/MessagingPortal'));

// ✅ Lazy load RoleManagement for SuperAdmin
const RoleManagement = React.lazy(() => import('../components/admin/roles/RoleManagement'));

export default function AppRoutes() {
  const { hydrated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("✅ AppRoutes component is rendering");
  }, []);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/register/success" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/same-day-services" element={<SameDayServicesPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/courses" element={<VideoLibrary />} />
            <Route path="/tax-calculator" element={<TaxCalculator />} />
            <Route path="/tax-forms" element={<TaxFormsPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/videos/:videoId" element={<VideoDetail />} />

            {/* ✅ Portals with role protection */}
            <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminPortal /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

            <Route path="/superadmin/*" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminPortal /></ProtectedRoute>} />
            <Route path="/superadmin/roles" element={<ProtectedRoute allowedRoles={['superadmin']}><RoleManagement /></ProtectedRoute>} />

            <Route path="/client/*" element={<ProtectedRoute allowedRoles={['client']}><ClientPortal /></ProtectedRoute>} />
            <Route path="/client/dashboard" element={<ProtectedRoute allowedRoles={['client']}><ClientDashboard /></ProtectedRoute>} />

            <Route path="/investor/*" element={<ProtectedRoute allowedRoles={['investor']}><InvestorPortal /></ProtectedRoute>} />
            <Route path="/investor/dashboard" element={<ProtectedRoute allowedRoles={['investor']}><InvestorDashboard /></ProtectedRoute>} />

            <Route path="/professional/*" element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalPortal /></ProtectedRoute>} />
            <Route path="/professional/dashboard" element={<ProtectedRoute allowedRoles={['professional']}><ProfessionalDashboard /></ProtectedRoute>} />

            <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentPortal /></ProtectedRoute>} />
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />

            <Route path="/messaging/*" element={<ProtectedRoute allowedRoles={['admin', 'superadmin', 'client', 'investor', 'professional', 'student']}><MessagingPortal /></ProtectedRoute>} />
            <Route path="/messaging/:senderId" element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><ConversationView /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* ✅ Only render Jennifer when auth is hydrated */}
      {hydrated && <JenniferWidget />}
    </Suspense>
  );
}