import React from 'react';

interface SecuritySettingsProps {
    settings: { 
      twoFactorEnabled: boolean; 
      lastPasswordChange: string; 
      sessionTimeout: number; 
    } | undefined;
    onSave: (data: any) => void;
    isLoading: boolean;
  }
  
  // Removed duplicate definition of SecuritySettings
export const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      <p>Adjust password, 2FA, and session management settings.</p>
    </div>
  );
};