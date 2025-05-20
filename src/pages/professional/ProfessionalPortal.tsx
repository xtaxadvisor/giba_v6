import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProfessionalDashboard from "../../components/professional/ProfessionalDashboard";
import { ClientList } from '../../components/professional/ClientList';
import { Analytics } from '../../components/professional/Analytics';
import { TaskManager } from '../../components/professional/TaskManager';
import { Reports } from '../../components/professional/Reports';
import { Billing } from '../../components/professional/Billing';
import MessagingInbox from '../messaging/MessagingInbox';
import { Documents } from '../../components/dashboard/Documents';
import { Calendar } from '../../components/dashboard/Calendar';
import { Settings } from '../../components/dashboard/Settings';
import { ProfessionalLayout } from '../../components/professional/ProfessionalLayout';



export default function ProfessionalPortal() {
  return (
    <ProfessionalLayout>
      <Helmet>
        <title>Professional Portal | ProTaxAdvisors</title>
        <meta name="description" content="Manage tasks, clients, reports, and more in your professional dashboard." />
      </Helmet>
      <Routes>
        <Route path="/" element={<ProfessionalDashboard />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/tasks" element={<TaskManager />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/messages" element={<MessagingInbox />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
       
      </Routes>
    </ProfessionalLayout>
  );
}