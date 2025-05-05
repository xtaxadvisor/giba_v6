import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext'; // Adjust the path as needed
const queryClient = new QueryClient();

// Eagerly load critical components
import Home from '../pages/Home';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

// Lazy load other components
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const ServiceCatalog = React.lazy(() => import('../pages/services/ServiceCatalog'));
const SameDayServices = React.lazy(() => import('../pages/services/SameDayServices'));
const VideoLibrary = React.lazy(() => import('../pages/videos/VideoLibrary'));
const VideoDetail = React.lazy(() => import('../pages/videos/VideoDetail'));
const AdminPortal = React.lazy(() => import('../pages/admin/AdminPortal'));
const ClientPortal = React.lazy(() => import('../pages/client/ClientPortal'));
const InvestorPortal = React.lazy(() => import('../pages/investor/InvestorPortal'));
const StudentPortal = React.lazy(() => import('../pages/student/StudentPortal'));
const ProfessionalPortal = React.lazy(() => import("../pages/professional/ProfessionalPortal"));
const TaxCalculator = React.lazy(() => import('../pages/calculator/TaxCalculator'));
const TaxForms = React.lazy(() => import('../pages/forms/TaxForms'));
const TermsAndConditions = React.lazy(() => import('../pages/legal/TermsAndConditions'));
const MessagingPortal = React.lazy(() => import('../pages/messaging/MessagingPortal'));
const BookConsultation: React.LazyExoticComponent<React.FC> = React.lazy(() => import('../components/consultation/ConsultationBookingForm'));
const ConfirmationPage = React.lazy(() => import('../components/consultation/ConfirmationPage'));

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/terms-and-conditions" element={
        <Suspense fallback={<LoadingSpinner />}>
          <TermsAndConditions />
        </Suspense>
      } />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />
      <Route path="/services" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ServiceCatalog />
        </Suspense>
      } />
      <Route path="/same-day-services" element={
        <Suspense fallback={<LoadingSpinner />}>
          <SameDayServices />
        </Suspense>
      } />
      <Route path="/calculator" element={
        <Suspense fallback={<LoadingSpinner />}>
          <TaxCalculator />
        </Suspense>
      } />
      <Route path="/tax-forms" element={
        <Suspense fallback={<LoadingSpinner />}>
          <TaxForms />
        </Suspense>
      } />
      <Route path="/browse-videos" element={
        <Suspense fallback={<LoadingSpinner />}>
          <VideoLibrary />
        </Suspense>
      } />
      <Route path="/browse-videos/:videoId" element={
        <Suspense fallback={<LoadingSpinner />}>
          <VideoDetail />
        </Suspense>
      } />
      
      {/* Auth Routes */}
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<LoadingSpinner />}>
          <RegisterPage />
        </Suspense>
      } />

      {/* Portal Routes - Auth checks disabled for development */}
      <Route path="/admin/*" element={<AdminPortal />}>
        <Route index element={<div>Admin Dashboard</div>} />
        <Route path="team" element={<div>Team Management</div>} />
        <Route path="ai-monitor" element={<div>AI Monitoring Dashboard</div>} />
      </Route>

      <Route
        path="/client/*"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ClientPortal />
          </Suspense>
        }
      >
        <Route index element={<div>Client Dashboard</div>} />
        <Route path="documents" element={<div>Client Documents</div>} />
        <Route path="messages" element={<div>Client Messages</div>} />
        <Route path="consultation">
          <Route
            path="book"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BookConsultation />
              </Suspense>
            }
          />
          <Route
            path="confirmation"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ConfirmationPage />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route
        path="/investor/*"
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <InvestorPortal />
          </Suspense>
        }
      >
        <Route index element={<div>Investor Dashboard</div>} />
        <Route path="forum" element={<div>Investor Forum</div>} />
        <Route path="videos" element={<div>Investor Videos</div>} />
      </Route>

      <Route path="/student/*" element={<StudentPortal />}>
        <Route index element={<div>Student Dashboard</div>} />
        <Route path="courses" element={<div>Courses</div>} />
        <Route path="progress" element={<div>Progress Tracker</div>} />
      </Route>

      <Route path="/professional/*" element={<ProfessionalPortal />}>
        <Route index element={<div>Professional Dashboard</div>} />
        <Route path="clients" element={<div>Client List</div>} />
        <Route path="analytics" element={<div>Analytics</div>} />
      </Route>

      {/* Messages Route */}
      <Route path="/messages/*" element={
        <Suspense fallback={<LoadingSpinner />}>
          <MessagingPortal />
        </Suspense>
      } />
      
      <Route
        path="*"
        element={
          <div className="text-center py-20 text-xl text-gray-500">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
