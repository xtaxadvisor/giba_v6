import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'admin' | 'editor' | 'viewer';

export function useRoles() {
  type Role = {
    permissions: any;
    userCount: ReactNode; id: string; name: string; created_at?: string 
};
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = true; // replace with real role check in a full app

  useEffect(() => {
    const fetchRoles = async () => {
      const { data, error } = await supabase.from('roles').select('id, name, created_at');
      if (data) {
        setRoles(
          data.map(role => ({
            ...role,
            permissions: {}, // Default value for permissions
            userCount: null, // Default value for userCount
          }))
        );
      }
      setLoading(false);
    };
    fetchRoles();
  }, []);

  const createRole = async (data: Role) => {
    if (!isAdmin) return;
    const { data: inserted, error } = await supabase.from('roles').insert([data]).select();
    if (inserted) setRoles(prev => [...prev, ...inserted]);
  };

  const updateRole = async (data: Role) => {
    if (!isAdmin) return;
    const { data: updated, error } = await supabase
      .from('roles')
      .update({ name: data.name })
      .eq('id', data.id)
      .select();
    if (updated) {
      setRoles(prev => prev.map(role => (role.id === data.id ? updated[0] : role)));
    }
  };

  const deleteRole = async (id: string) => {
    if (!isAdmin) return;
    const { error } = await supabase.from('roles').delete().eq('id', id);
    if (!error) {
      setRoles(prev => prev.filter(role => role.id !== id));
    }
  };

  return {
    roles,
    createRole,
    updateRole,
    deleteRole,
    loading,
  };
}