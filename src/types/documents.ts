export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startedAt?: string;
  completedAt?: string;
  error?: string;
}
// Add this export if it doesn't exist
export type Recommendation = {
  message: string;
  severity: 'low' | 'medium' | 'high';
};
// Define and export the Finding type
export interface Finding {
  type: 'success' | 'warning';
  message: string;
}
// Define and export the Document type
export interface Document {
  id: string;
  title: string;
  description?: string; // Added optional description property
}

export interface QueuedDocument {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  steps: ProcessingStep[];
}