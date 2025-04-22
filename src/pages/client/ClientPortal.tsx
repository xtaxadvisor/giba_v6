import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../../components/client/ClientLayout';
import { ClientDashboard } from '../../components/client/Dashboard/ClientDashboard';
import { Documents } from '../../components/dashboard/Documents';
import { Messages } from '../../components/dashboard/Messages';
import { Calendar } from '../../components/dashboard/Calendar';
import { Settings } from '../../components/dashboard/Settings';
import { ConsultationList } from '../../components/consultation/ConsultationList';
import { ClientInsights } from '../../components/client/Dashboard/ClientInsights';
import { useAuth } from '../../contexts/AuthContext';

export default function ClientPortal() { 
  const { logout } = useAuth();

  return ( 
  <ClientLayout>
    <button
      onClick={logout}
      className="logout-button mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Logout
    </button>
    <Routes>
      <Route index element={<ClientDashboard />} />
      <Route path="documents" element={<Documents />} />
      <Route path="messages" element={<Messages />} />
      <Route path="appointments" element={<Calendar />} />
      <Route path="consultations" element={<ConsultationList />} />
      <Route path="finances" element={<ClientInsights />} />
      <Route path="tax-planning" element={<ClientInsights />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </ClientLayout>
  )
}