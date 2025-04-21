

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface Insight {
  id: string;
  title: string;
  value: number;
  change?: number; // optional percent change
}

export default function InvestorInsights() {
  const { investorId } = useParams<{ investorId: string }>();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!investorId) {
      setError('No investor ID provided.');
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        const response = await axios.get(`/api/investors/${investorId}/insights`);
        setInsights(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [investorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Investor Insights</h1>
      {insights.length === 0 ? (
        <p>No insights available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border rounded">
              <h2 className="text-lg font-medium">{insight.title}</h2>
              <p className="text-3xl font-bold">{insight.value}</p>
              {insight.change !== undefined && (
                <p className={`mt-1 text-sm ${insight.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {insight.change > 0 ? '+' : ''}
                  {insight.change}%
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}