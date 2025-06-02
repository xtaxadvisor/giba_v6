// ClientPortal.tsx (Wired with RoleAuth)
import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../../components/client/ClientLayout';
import { ClientDashboard } from '../../components/client/Dashboard/ClientDashboard';
import { Documents } from '../../components/dashboard/Documents';
import MessagingPortal from '../../pages/messaging/MessagingPortal';
import { Calendar } from '../../components/dashboard/Calendar';
import { Settings } from '../../components/dashboard/Settings';
import { ConsultationList } from '../../components/consultation/ConsultationList';
import { ClientInsights } from '../../components/client/Dashboard/ClientInsights';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { RoleAuth } from '@/components/auth/RoleAuth';

export default function ClientPortal() {
  const { logout } = useAuth();

  return (
    <RoleAuth allowedRoles={['client', 'superadmin']}>
      <ClientLayout>
        <button
          onClick={() => logout()}
          className="logout-button mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Logout
        </button>
        <Helmet>
          <title>Client Portal | ProTaxAdvisors</title>
          <meta
            name="description"
            content="Access your dashboard, documents, consultations, and more through the secure ProTaxAdvisors client portal."
          />
        </Helmet>
        <Routes>
          <Route index element={<ClientDashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="messages" element={<MessagingPortal />} />
          <Route path="appointments" element={<Calendar />} />
          <Route path="consultations" element={<ConsultationList />} />
          <Route path="finances" element={<ClientInsights />} />
          <Route path="tax-planning" element={<ClientInsights />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </ClientLayout>
    </RoleAuth>
  );
}