import { setupCache } from 'axios-cache-adapter';
import { AxiosRequestConfig } from 'axios';

export const cache = setupCache({
  maxAge: 15 * 60 * 1000, // 15 minutes
  store: undefined, // Replace with a proper async store if needed
  exclude: {
    query: false,
    methods: ['post', 'put', 'delete']
  },
  key: (req: AxiosRequestConfig) => {
    const url = req.url || ''; // Handle undefined url
    const serialized = req.params ? `${url}?${JSON.stringify(req.params)}` : url;
    return `${req.method}:${serialized}`;
  },
  invalidate: async (cfg: any) => {
    const invalidatePatterns = cfg.invalidateCache as string[];
    if (invalidatePatterns) {
      await Promise.all(
        invalidatePatterns.map(pattern => (cache.store as Storage).removeItem(pattern))
      );
    }
  }
});