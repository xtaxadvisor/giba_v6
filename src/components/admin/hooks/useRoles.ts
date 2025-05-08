export const USER_ROLES = ['admin', 'editor', 'viewer'];

export function useRoles() {
  type Role = { id: string; name: string };
  const roles: Role[] = USER_ROLES.map(role => ({ id: role, name: role }));

  const createRole = async (data: any) => {
    roles.push({ id: data.id, name: data.name });
  };

  const updateRole = async (data: any) => {
    const roleIndex = roles.findIndex(role => role.id === data.id);
    if (roleIndex !== -1) {
      roles[roleIndex] = { id: data.id, name: data.name };
    }
  };

  const deleteRole = async (id: string) => {
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