import React from 'react';

interface ProfileSettingsProps {
        settings: {
          companyName: string;
          website: string;
          address: string;
          phone: string;
          email: string;
        } | undefined;
        onSave: (sectionData: any) => Promise<void>;
        isLoading: boolean;
    }
      
      export function ProfileSettingsForm({ settings, onSave }: ProfileSettingsProps) {
        return (
          <div>
            <h2>Profile Settings Form</h2>
            <p>Company Name: {settings?.companyName}</p>
            <p>Website: {settings?.website}</p>
            <p>Address: {settings?.address}</p>
            <p>Phone: {settings?.phone}</p>
            <p>Email: {settings?.email}</p>
            <button onClick={() => onSave(settings)}>Save</button>
          </div>
        );
      }
export interface ProfileSettingsComponentProps {
    settings: {
      companyName: string;
      website: string;
      address: string;
      phone: string;
      email: string;
    } | undefined;
    onSave: (sectionData: any) => Promise<void>;
    isLoading: boolean;
  }
// This component is a placeholder for the actual ProfileSettings component
  
  export function ProfileSettingsComponent({ settings, onSave, isLoading }: ProfileSettingsProps) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Company Name: {settings?.companyName}</p>
            <p>Website: {settings?.website}</p>
            <p>Address: {settings?.address}</p>
            <p>Phone: {settings?.phone}</p>
            <p>Email: {settings?.email}</p>
                      <button onClick={() => onSave(settings)}>Save Changes</button>
            </div>
        )}
        </div>
        );
        }
// This component is a placeholder for the actual ProfileSettings component

export const ProfileSettingsOverview: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
      <p>Edit your personal information, avatar, and preferences.</p>
    </div>
  );
};