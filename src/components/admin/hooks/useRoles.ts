import { useAuth } from '@/contexts/AuthContext';
export function useRoles() {
    useAuth(); // Call useAuth without assigning it to a variable
    type Role = { id: string; name: string }; // Define Role type
    const roles: Role[] = []; // Replace with actual logic to fetch roles
    const createRole = async (data: any) => {
      // Example implementation using 'data'
      roles.push({ id: data.id, name: data.name });
    };
    const updateRole = async (data: any) => {
      // Example implementation using 'data'
      const roleIndex = roles.findIndex(role => role.id === data.id);
      if (roleIndex !== -1) {
        roles[roleIndex] = { id: data.id, name: data.name };
      }
    };
    const deleteRole = async (id: string) => {
      // Remove the role with the matching id from the roles array
      const roleIndex = roles.findIndex(role => role.id === id);
      if (roleIndex !== -1) {
        roles.splice(roleIndex, 1);
      }
    };
  
    return {
      roles,
      createRole,
      updateRole,
      deleteRole,
    };
  }