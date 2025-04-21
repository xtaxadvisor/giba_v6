import React from 'react';
import { useParams } from 'react-router-dom';
import InvestorLayout from '../../components/investor/InvestorLayout';

interface InvestorProfileParams extends Record<string, string | undefined> {
  investorId: string;
}

export default function InvestorProfile() {
  const { investorId } = useParams<InvestorProfileParams>();

  // TODO: fetch investor data by investorId (e.g., via a hook or service)

  return (
    <InvestorLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Investor Profile</h1>
        <p>Showing details for investor with ID: <code>{investorId}</code></p>
        {/* Add investor details here */}
      </div>
    </InvestorLayout>
  );
}
