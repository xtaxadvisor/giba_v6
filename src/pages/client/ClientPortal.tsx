import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../../components/client/ClientLayout';
import { ClientDashboard } from '../../components/client/Dashboard/ClientDashboard';
import { Documents } from '../../components/dashboard/Documents';
import { Messages } from '../../components/dashboard/Messages';
import { Calendar } from '../../components/dashboard/Calendar';
import { Settings } from '../../components/dashboard/Settings';
import { ConsultationList } from '../../components/consultation/ConsultationList';
import { ClientInsights } from '../../components/client/Dashboard/ClientInsights';

export default function ClientPortal() { 
  return ( 
  <ClientLayout>
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