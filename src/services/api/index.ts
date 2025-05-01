export * from './auth';
export * from './client';
export * from './document';
export * from './task';
export * from './messages';
export * from './analytics';
// Explicitly re-export to avoid naming conflicts
export { create as createConsultation } from './consultationService';
export * from './appointmentService';
// Add others here like authService, paymentService, etc.