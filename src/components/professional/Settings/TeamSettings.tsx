
// Removed duplicate TeamSettingsProps interface declaration
interface TeamSettingsProps {
  settings: {
    members: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
    }[];
  };
  onSave: (sectionData: any) => Promise<void>;
  isLoading: boolean;
}

export function TeamSettings({ settings, onSave, isLoading }: TeamSettingsProps) {
  return (
    <div>
      <h2>Team Settings</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {settings?.members.map((member) => (
            <li key={member.id}>
              {member.name} - {member.role} ({member.status})
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => onSave(settings)}>Save Changes</button>
    </div>
  );
}
  export function TeamSettingsComponent({ settings, onSave, isLoading }: TeamSettingsProps) {
      return (
        <div>
          <h3>Team Settings Component</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {settings?.members.map((member) => (
                <li key={member.id}>
                  {member.name} - {member.role} ({member.status})
                </li>
              ))}
            </ul>
          )}
          <button onClick={() => onSave(settings)}>Save Changes</button>
        </div>
      );
    }
// Removed duplicate TeamSettingsProps interface declarations

// Removed duplicate TeamSettingsProps interface declaration
//       )}
//               {activeSection === 'notifications' && (
//                 <NotificationsSettingsForm
//                   settings={settings?.notifications} // Removed the extra dot    
//                   onSave={onSave} // Removed the extra dot 
//                   isLoading={isLoading} //                 />
//               )}
//               {activeSection === 'team' && (
//                 <TeamSettings
//                   settings={settings?.team}
//                   onSave={onSave}
//                   isLoading={isLoading}
//                 />
//               )}
//             </div>
//           </div>
//         </div>   
//       )}
//     </div>
//   );
// Removed unused import statements
// Removed unused function definition 
// Removed unused component definition
// Removed unused function definition
// Removed unused function definition