import { Routes, Route } from 'react-router-dom';
import { InvestorDashboard } from '../../components/investor/InvestorDashboard'; 
import { VideoLibrary } from '../../components/investor/VideoLibrary';
import InvestorLayout from '../../components/investor/InvestorLayout';
import InvestorForum from '../investor/InvestorForum';
import MessagingPortal from '../../pages/messaging/MessagingPortal';


export default function InvestorPortal() {
  return (
    <InvestorLayout>
      <Routes>
        <Route index element={<InvestorDashboard />} /> {' '} 
        <Route path="dashboard" element={<InvestorDashboard />} />
        <Route path="documents" element={<InvestorDashboard />} />
        <Route path="messages" element={<MessagingPortal />} />
        <Route path="appointments" element={<InvestorDashboard />} />
        <Route path="consultations" element={<InvestorDashboard />} />
        <Route path="finances" element={<InvestorDashboard />} />
        <Route path="tax-planning" element={<InvestorDashboard />} />
        <Route path="settings" element={<InvestorDashboard />} />
        <Route path="calendar" element={<InvestorDashboard />} />
        <Route path="videos" element={<VideoLibrary videos={[]} />} />
        <Route path="forum" element={<InvestorForum />} /> 
      </Routes>
    </InvestorLayout>
  );
}