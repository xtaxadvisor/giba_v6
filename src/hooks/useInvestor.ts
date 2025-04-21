import { useState, useEffect, useCallback } from 'react';
import type { Investor } from '../types/client'; // adjust path to your Investor type
import { getInvestor, updateInvestor } from '../services/api'; // adjust import paths

export default function useInvestor(id: string) {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getInvestor(id);
        setInvestor({ ...data, settings: (data as any).settings || {} });
      } catch (err: any) {
        setError(err.message || 'Failed to load investor');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const saveInvestor = useCallback(
    async (updates: Partial<Investor>) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updateInvestor(id, updates);
        setInvestor((prev) => ({
          ...prev,
          ...updated,
        } as Investor));
        return updated;
      } catch (err: any) {
        setError(err.message || 'Failed to update investor');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  return {
    investor,
    loading,
    error,
    saveInvestor,
  };
}
