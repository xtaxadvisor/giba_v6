import React, { useState, useEffect } from 'react';
import { injectDevSession, getCurrentRole, clearDevSession } from '@/lib/auth/devBypass';
import { useNavigate } from 'react-router-dom';

import { UserRole } from '@/lib/auth/devBypass';

const roles: UserRole[] = ['admin', 'student', 'client', 'investor', 'professional'];

export const DevRoleSwitcher: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = (getCurrentRole() as unknown) as string | null;
    setCurrentRole(role);
  }, []);

  const handleSwitch = (newRole: UserRole) => {
    injectDevSession(newRole);
    window.location.href = `/${newRole}`;
  };

  const handleReset = () => {
    clearDevSession();
    navigate('/');
    window.location.reload();
  };

  if (!import.meta.env.DEV) return null; // Disable in production

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 shadow-lg rounded-md px-4 py-3 text-sm space-y-2">
      <div>
        <strong>Active Dev Role:</strong>{' '}
        <span className="text-blue-600 font-semibold">{currentRole ?? 'None'}</span>
      </div>

      <div className="flex flex-col space-y-1">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleSwitch(role)}
            className={`w-full px-3 py-1 rounded text-left ${
              currentRole === role
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <button
        onClick={handleReset}
        className="w-full text-red-600 text-xs underline mt-2"
      >
        Clear Dev Session
      </button>
    </div>
  );
};