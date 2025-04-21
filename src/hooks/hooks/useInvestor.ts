import { useState, useEffect } from 'react';
import { getInvestor } from '@/services/api'; // adjust this import to match your actual API function path



export interface InvestorSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  timezone: string;
}
export interface InvestorSettingsForm {
  emailNotifications: boolean;
  smsNotifications: boolean;
  timezone: string;
}


interface Investor {
  id: string;
  settings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    timezone: string;
  };
}

export function useMockInvestor() {
  const [investor, setInvestor] = useState<Investor | null>(null);

  useEffect(() => {
    // Simulate fetching investor data
    setTimeout(() => {
      setInvestor({
        id: '123',
        settings: {
          emailNotifications: true,
          smsNotifications: false,
          timezone: 'America/New_York',
        },
      });
    }, 1000);
  }, []);

  const refetch = async () => {
    // Simulate refetching investor data
    setInvestor({
      id: '123',
      settings: {
        emailNotifications: true,
        smsNotifications: false,
        timezone: 'America/New_York',
      },
    });
  };

  return { investor, refetch }; // Mock implementation
}

export default function useInvestor(investorId: string) {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!investorId) {
      setInvestor(null);
      return;
    }
    setLoading(true);
    setError(null);
    getInvestor(investorId)
      .then((data: any) => {
        const transformedData: Investor = {
          id: data.id,
          settings: {
            emailNotifications: data.settings?.emailNotifications ?? false,
            smsNotifications: data.settings?.smsNotifications ?? false,
            timezone: data.settings?.timezone ?? 'UTC',
          },
        };
        setInvestor(transformedData);
      })
      .catch((error: Error) => setError(error))
        .finally(() => setLoading(false));
    // Mock implementation of fetching investor data
    // Simulate fetching investor data
    // setTimeout(() => {
    //   setInvestor({
    //     id: '123',
    //     settings: {
    //       emailNotifications: true,
    //       smsNotifications: false,
    //       timezone: 'America/New_York',

    //     },
    //   });    
   // }, 1000); 
      });
    }   