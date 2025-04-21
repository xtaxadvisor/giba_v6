// src/services/api/clients.ts
export const fetchClients = async () => {
  const res = await fetch('/api/clients');
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
};