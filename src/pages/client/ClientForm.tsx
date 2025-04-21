import React, { useState } from 'react';
import ImportedClientForm from './ClientForm';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Documents } from '../../pages/client/ClientDocuments'; // Adjust the path to the actual location of the Documents component
import { ClientDashboard } from '../../components/client/Dashboard/ClientDashboard'; // Corrected the path to the actual location
import { MessagingCenter } from '../../components/messaging/MessagingCenter'; // Adjusted the path to the correct location of the MessagingCenter component
import ClientLayout from '../../components/client/ClientLayout'; // Adjusted the path to the correct location
import { useCalendar } from '../../hooks/useCalendar'; // Adjust the path to the actual location of useCalendar
import { ConsultationList } from '../../components/consultation/ConsultationList'; // Adjust the path to the actual location of ConsultationList
import { ClientInsights } from '../../components/client/Dashboard/ClientInsights'; // Corrected the path to the actual location of ClientInsights

const Appointments: React.FC = () => {
  const { events, isLoading } = useCalendar();
  const title = "Appointments"; // Define the title variable

  return (
    <div>
      <h1>{title}</h1>
      <p>{isLoading ? 'Loading events...' : `You have ${events?.length || 0} events.`}</p>
    </div>
  );
};


const ClientForm: React.FC<{ initialData: any; onSubmit: (data: any) => void; onCancel: () => void }> = ({ initialData, onSubmit, onCancel }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(initialData);
      }}
    >
      {/* Form fields go here */}
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default ClientForm;
const ClientPortal: React.FC = () => {
  const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);

  return (
    <>
      {!clientInfoSubmitted ? (
        <ImportedClientForm
          initialData={{ firstName: '', lastName: '', email: '', phone: '' }}
          onSubmit={(data) => {
            console.log('Client info submitted:', data);
            setClientInfoSubmitted(true);
          }}
          onCancel={() => {
            // Optional: redirect or show a message
          }}
        />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ClientLayout
                  description="Welcome to your client portal. Here you can manage your documents, messages, appointments, and more."
                >
                  <Outlet />
                </ClientLayout>
                <Route path="appointments" element={<Appointments />} />
              </>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="messages" element={<MessagingCenter />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="consultations" element={<ConsultationList />} />
            <Route path="finances" element={<ClientInsights />} />
          </Route>
        </Routes>
      )}
    </>
  );
};