
import React, { useState, useEffect } from 'react';
import useInvestor from '@/hooks/useInvestor';
import { updateInvestorSettings } from '../../services/api/consultationService'; 

interface InvestorSettingsForm {
  emailNotifications: boolean;
  smsNotifications: boolean;
  timezone: string;
}

export default function InvestorSettings(): JSX.Element {
  const investorId = 'some-id'; // Replace 'some-id' with the actual investor ID
  const { investor, saveInvestor } = useInvestor(investorId);
  const [form, setForm] = useState<InvestorSettingsForm>({
    emailNotifications: false,
    smsNotifications: false,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (investor) {
      setForm({
        emailNotifications: investor.settings.emailNotifications,
        smsNotifications: investor.settings.smsNotifications,
        timezone: investor.settings.timezone,
      });
      setLoading(false);
    }
  }, [investor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, checked, value } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (investor) {
        await updateInvestorSettings(investor.id, form);
      } else {
        throw new Error('Investor data is not available.');
      }
      await saveInvestor({ ...investor, settings: form });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading settings…</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Investor Settings</h1>
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={form.emailNotifications}
            onChange={handleChange}
            disabled={saving}
            className="form-checkbox"
          />
          <span>Email Notifications</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="smsNotifications"
            checked={form.smsNotifications}
            onChange={handleChange}
            disabled={saving}
            className="form-checkbox"
          />
          <span>SMS Notifications</span>
        </label>
        <label className="block">
          <span>Timezone</span>
          <select
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            disabled={saving}
            className="mt-1 block w-full border rounded p-2"
          >
            <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </option>
            {/* Add more timezones here if desired */}
          </select>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}