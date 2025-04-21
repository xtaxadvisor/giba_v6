const API_URL = import.meta.env.VITE_API_URL || '/.netlify/functions';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
// existing exports in the file
// export { updateInvestor }; // Removed as it is not defined

// mock implementation of getInvestor
interface Investor {
  id: string;
  name: string;
  email: string;
}

export async function getInvestor(id: string): Promise<Investor> {
  // Replace with actual API call logic
  return { id, name: 'Sample Investor', email: 'investor@example.com' };
}

export const updateInvestor = async (id: string, updates: Partial<Investor>) => { // Added this line    
  // Replace with actual API call logic
  console.log(`Updating investor ${id} with`, updates);
  // This is a mock implementation. Replace with actual API call.
  return { id, ...updates }; // Mock response
  // In a real implementation, you would return the updated investor object from the API
  // after making the API call. This is just a placeholder for the sake of example.
  // You can also handle errors and other response statuses as per your API's design.
  // For example, you might want to check if the response is successful and throw an error
  // if it is not. This is just a simple example to illustrate the structure of the function.
  // You can also add error handling, logging, or any other necessary logic as per your 
  // implementation
};
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),

  getAll: async <T>(endpoint: string): Promise<T> => {
    console.log(`[api:getAll] Fetching from ${endpoint}...`);
    const res = await api.get<T>(endpoint);
    console.log(`[api:getAll] Response:`, res);
    return res;
  }
};