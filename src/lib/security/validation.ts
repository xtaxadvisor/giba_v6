import { z } from 'zod';
import DOMPurify from 'dompurify';
import { SECURITY_CONFIG } from './config';

// Input validation schemas
export const inputSchemas = {
  email: z.string().email().min(5).max(255),
  password: z.string()
    .min(SECURITY_CONFIG.auth.passwordMinLength)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[\d\s-()]+$/).min(10).max(20).optional(),
  url: z.string().url().max(2048).optional()
};

// XSS prevention with proper typing
export function sanitizeInput(input: string): string {
  if (typeof window === 'undefined') {
    return input; // Server-side handling
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [], // No attributes allowed
    SANITIZE_DOM: true,
    USE_PROFILES: { html: false }
  });
}

// Object sanitization with type safety
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: typeof value === 'string' ? sanitizeInput(value) : value
    };
  }, {} as T);
  return sanitized;
}

// SQL injection prevention
export function escapeSQLString(value: string): string {
  return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\"+char;
      default:
        return char;
    }
  });
}

// Validate file upload
export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type' };
  }

  // Sanitize filename
  const sanitizedName = sanitizeInput(file.name);
  if (sanitizedName !== file.name) {
    return { isValid: false, error: 'Invalid characters in filename' };
  }

  return { isValid: true };
}