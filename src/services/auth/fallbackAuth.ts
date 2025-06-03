import { useNotificationStore } from '../../lib/store';
import { createSecureHash } from '../../utils/crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TEMP_CREDENTIALS = {
  email: 'admin@protaxadvisors.tax',
  passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // admin
};

/**
 * Validates a master login and logs the event to audit_logs
 * @param email string
 * @param password string
 * @param req (optional) Request object with headers (for logging)
 */
export async function checkMasterLogin(
  email: string,
  password: string,
  req?: { headers?: Record<string, any> }
): Promise<boolean> {
  try {
    if (email !== TEMP_CREDENTIALS.email) return false;

    const hashedPassword = await createSecureHash(password);
    const isMasterPassword = hashedPassword === TEMP_CREDENTIALS.passwordHash;

    if (isMasterPassword) {
      console.warn('🛡️ Master login used at:', new Date().toISOString());

      useNotificationStore.getState().addNotification(
        'Using temporary admin access',
        'info'
      );

      // ✅ Log this event in the audit_logs table
      await supabase.from('audit_logs').insert({
        event: 'master_login_used',
        metadata: {
          ip: req?.headers?.['x-forwarded-for'] || 'unknown',
          browser: req?.headers?.['user-agent'] || 'unknown'
        },
        timestamp: new Date().toISOString()
      });
    }

    return isMasterPassword;
  } catch (error) {
    console.error('❌ Master login check failed:', error);
    return false;
  }
}
