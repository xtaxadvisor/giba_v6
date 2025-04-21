import { retryAdapterEnhancer } from 'axios-extensions';

export const retryConfig = {
  times: 3,
  shouldRetry: (error: any) => {
    // Retry on network errors and 5xx responses
    return !error.response || (error.response.status >= 500 && error.response.status <= 599);
  },
  delay: (retryCount: number) => {
    // Exponential backoff
    return Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
  }
};

export const retryAdapter = retryAdapterEnhancer(
  (axios: any) => axios,
  retryConfig
);