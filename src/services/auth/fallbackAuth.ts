import { useNotificationStore } from '../../lib/store';
import { createSecureHash } from '../../utils/crypto';

// Temporary credentials - ONLY FOR DEVELOPMENT
const TEMP_CREDENTIALS = {
  email: 'admin@protaxadvisors.tax',
  passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // admin
};

export async function checkMasterLogin(email: string, password: string): Promise<boolean> {
  try {
    if (email !== TEMP_CREDENTIALS.email) return false;
    
    const hashedPassword = await createSecureHash(password);
    const isMasterPassword = hashedPassword === TEMP_CREDENTIALS.passwordHash;
    
    if (isMasterPassword) {
      // Log master login attempt for security auditing
      console.warn('Master login used at:', new Date().toISOString());
      useNotificationStore.getState().addNotification(
        'Using temporary admin access',
        'info'
      );
    }
    
    return isMasterPassword;
  } catch (error) {
    console.error('Master login check failed:', error);
    return false;
  }
}