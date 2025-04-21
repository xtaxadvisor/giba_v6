export const SECURITY_CONFIG = {
  auth: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 60 * 60 * 1000, // 1 hour
    passwordMinLength: 12,
    requireMFA: false
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // per window
  },
  csrf: {
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN'
  },
  headers: {
    'Content-Security-Policy': 
      "default-src 'self' https://*.supabase.co; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https://*.unsplash.com https://*.supabase.co; " +
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co;",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
};