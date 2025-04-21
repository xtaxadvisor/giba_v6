import { Routes, Route, Navigate } from 'react-router-dom';
import { ConsultationLayout } from '@/components/consultation/ConsultationLayout';
import { ConsultationList } from '@/components/consultation/ConsultationList';
import BookConsultation    from '@/components/consultation/BookConsultation';
import ConsultationDetail from '@/components/consultation/ConsultationDetail';
import ConfirmationPage   from '@/components/consultation/ConfirmationPage';

export function ConsultationRoutes() {
  return (
    <Routes>
      <Route path="/consultation/*" element={<ConsultationLayout />}>
        <Route index      element={<ConsultationList />} />
        <Route path="book" element={<BookConsultation />} />
        <Route path=":id"   element={<ConsultationDetail />} />
        <Route path="confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}