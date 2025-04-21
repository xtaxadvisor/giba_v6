import { SECURITY_CONFIG } from './config';

export class RateLimiter {
  private static instance: RateLimiter;
  private requests: Map<string, number[]> = new Map();

  private constructor() {}

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  public checkLimit(key: string): boolean {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.rateLimit.windowMs;
    
    // Get existing requests
    let requestTimestamps = this.requests.get(key) || [];
    
    // Remove old requests
    requestTimestamps = requestTimestamps.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (requestTimestamps.length >= SECURITY_CONFIG.rateLimit.maxRequests) {
      return false;
    }
    
    // Add new request
    requestTimestamps.push(now);
    this.requests.set(key, requestTimestamps);
    
    return true;
  }

  public getRemainingRequests(key: string): number {
    const requestTimestamps = this.requests.get(key) || [];
    return Math.max(0, SECURITY_CONFIG.rateLimit.maxRequests - requestTimestamps.length);
  }

  public clearRequests(key: string): void {
    this.requests.delete(key);
  }
}

export const rateLimiter = RateLimiter.getInstance();