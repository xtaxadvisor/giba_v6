import { sanitizeInput } from './validation';

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class SecureFileHandler {
  private static instance: SecureFileHandler;

  private constructor() {}

  public static getInstance(): SecureFileHandler {
    if (!SecureFileHandler.instance) {
      SecureFileHandler.instance = new SecureFileHandler();
    }
    return SecureFileHandler.instance;
  }

  public validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Allowed types: PDF, Word, Excel, JPEG, PNG'
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File size exceeds maximum allowed size of 10MB'
      };
    }

    // Sanitize filename
    const sanitizedName = sanitizeInput(file.name);
    if (sanitizedName !== file.name) {
      return {
        isValid: false,
        error: 'Invalid characters in filename'
      };
    }

    return { isValid: true };
  }

  public async scanFile(file: File): Promise<boolean> {
    // In production, implement virus scanning
    // For now, just validate file properties
    return this.validateFile(file).isValid;
  }

  public async hashFile(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

export const secureFileHandler = SecureFileHandler.getInstance();