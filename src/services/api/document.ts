import { api } from '../api';
import type { Document } from '../../types';

export interface CreateDocumentDTO {
  title: string;
  clientId: string;
  type: string;
  content: string;
  tags?: string[];
}
// Export the Document type
export type LocalDocument = {
  id: string;
  title: string;
  content: string;
};

export interface UpdateDocumentDTO extends Partial<CreateDocumentDTO> {
  id: string;
}
// Removed duplicate declaration of documentService

export const documentService = {
  getAll: () => 
    api.get<LocalDocument[]>('/documents'),

  getById: (id: string) => 
    api.get<LocalDocument>(`/documents/${id}`),

  getByClient: (clientId: string) => 
    api.get<LocalDocument[]>(`/clients/${clientId}/documents`),

  create: (data: CreateDocumentDTO) => 
    api.post<LocalDocument>('/documents', data),

  update: ({ id, ...data }: UpdateDocumentDTO) => 
    api.put<LocalDocument>(`/documents/${id}`, data),

  delete: (id: string) => 
    api.delete<void>(`/documents/${id}`),

  search: (query: string) => 
    api.get<Document[]>(`/documents/search?query=${encodeURIComponent(query)}`),
};