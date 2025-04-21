import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/api/document';
import type { Document } from '@/types/documents';
import { useState } from 'react';

// Removed duplicate import of Document

export function useDocuments() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({});

  // 🔄 Fetch all documents
  const {
    data: documents = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const localDocuments = await documentService.getAll();
      return localDocuments.map((doc: any) => ({
        ...doc,
        createdAt: doc.createdAt ? new Date(doc.createdAt) : undefined,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      }));
    },
  });

  // ⬆️ Upload
  const uploadDocumentMutation = useMutation({
    mutationFn: documentService.create, // Assuming 'create' is the intended method
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
  const uploadDocument = uploadDocumentMutation.mutate;

  const deleteDocumentMutation = useMutation({
    mutationFn: documentService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
  const deleteDocument = deleteDocumentMutation.mutate;
  // Removed unused isDeleting variable

  // 📤 Share (mock implementation for now)
  const shareDocument = (documentId: string) => {
    console.log(`Sharing document ID: ${documentId}`);
    // You could hook into backend here later
  };

  return {
    documents,
    isLoading,
    isError,
    filters,
    setFilters,
    refetch,
    uploadDocument,
    deleteDocument,
    shareDocument,
    isUploading: uploadDocumentMutation.status === 'pending',
    isDeleting: deleteDocumentMutation.status === 'pending',
  };
}