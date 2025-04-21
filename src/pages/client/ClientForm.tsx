import React, { useState } from 'react';
import { ClientForm } from './ClientForm';
import { Routes, Route, Outlet } from 'react-router-dom';
import ClientLayout from './ClientLayout'; // Adjust the path as necessary

const ClientPortal: React.FC = () => {
  const [clientInfoSubmitted, setClientInfoSubmitted] = useState(false);

  return (
    <>
      {!clientInfoSubmitted ? (
        <ClientForm
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
              <ClientLayout
                title="Client Portal"
                description="Welcome to your client portal. Here you can manage your documents, messages, appointments, and more."
              >
                <Outlet />
              </ClientLayout>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path="documents" element={<Documents />} />
            <Route path="messages" element={<Messages />} />
            <Route path="appointments" element={<CalendarWithModal title="Appointments" description="View and manage your appointments." />} />
            <Route path="consultations" element={<ConsultationList />} />
            <Route path="finances" element={<ClientInsights />} />
          </Route>
        </Routes>
      )}
    </>
  );
};