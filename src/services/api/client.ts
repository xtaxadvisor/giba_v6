// src/services/api/clients.ts
export const fetchClients = async () => {
  const res = await fetch('/api/clients');
  if (!res.ok) throw new Error('Failed to fetch clients');
  return res.json();
};

export function getById(clientId: string): any {
  throw new Error('Function not implemented.');
}
export function deleteClient(clientId: string) {
  throw new Error('Function not implemented.');
}

export function getAll(): any {
  throw new Error('Function not implemented.');
}

export function update(id: any, data: any): Promise<unknown> {
  throw new Error('Function not implemented.');
}

export function create(data: any): Promise<unknown> {
  throw new Error('Function not implemented.');
}

