import { SECURITY_CONFIG } from './config';

export class CSRFProtection {
  private static instance: CSRFProtection;
  private token: string | null = null;

  private constructor() {
    this.setupCSRFToken();
  }

  public static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }

  private setupCSRFToken(): void {
    this.token = this.generateToken();
    document.cookie = `${SECURITY_CONFIG.csrf.cookieName}=${this.token}; path=/; SameSite=Strict`;
  }

  private generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  public getToken(): string {
    if (!this.token) {
      this.setupCSRFToken();
    }
    return this.token!;
  }

  public validateToken(token: string): boolean {
    return token === this.token;
  }

  public getRequestHeaders(): Record<string, string> {
    return {
      [SECURITY_CONFIG.csrf.headerName]: this.getToken()
    };
  }
}

export const csrfProtection = CSRFProtection.getInstance();