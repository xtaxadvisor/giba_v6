// src/types/axios-cache-adapter.d.ts
declare module 'axios-cache-adapter' {
    import { AxiosRequestConfig, AxiosAdapter, AxiosInstance } from 'axios';
  
    export interface ISetupCacheOptions {
      maxAge?: number;
      store?: any;
      exclude?: {
        query?: boolean;
        methods?: string[];
      };
      key?(req: AxiosRequestConfig): string;
      invalidate?(cfg: any): Promise<void>;
    }
  
    // The factory you’re using:
    export function setupCache(opts: ISetupCacheOptions): {
      store: any;
      adapter: AxiosAdapter;
      invalidate(...args: any[]): Promise<void>;
    };
  
    // Extend axios with a cache adapter
    export function setup(options: ISetupCacheOptions): AxiosInstance;
  }