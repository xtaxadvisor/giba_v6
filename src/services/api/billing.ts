import { api } from '../api';

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  number: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  notes?: string;
}

export interface CreateInvoiceDTO {
  clientId: string;
  dueDate: string;
  items: Omit<InvoiceItem, 'id'>[];
  notes?: string;
}

export interface UpdateInvoiceDTO extends Partial<CreateInvoiceDTO> {
  id: string;
  status?: Invoice['status'];
}

export interface InvoiceStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  invoiceCount: number;
  paidCount: number;
  overdueCount: number;
}

export const billingService = {
  getInvoices: (params?: { status?: string; clientId?: string }) => 
    api.get<Invoice[]>(`/invoices${params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''}`),

  getInvoiceById: (id: string) => 
    api.get<Invoice>(`/invoices/${id}`),

  getInvoiceStats: () => 
    api.get<InvoiceStats>('/invoices/stats'),

  createInvoice: (data: CreateInvoiceDTO) => 
    api.post<Invoice>('/invoices', data),

  updateInvoice: ({ id, ...data }: UpdateInvoiceDTO) => 
    api.put<Invoice>(`/invoices/${id}`, data),

  deleteInvoice: (id: string) => 
    api.delete<void>(`/invoices/${id}`),

  markAsPaid: (id: string) => 
    api.put<Invoice>(`/invoices/${id}/paid`),

  downloadInvoice: (id: string, format: 'pdf' | 'csv' = 'pdf') => 
    api.get<Blob>(`/invoices/${id}/download?${new URLSearchParams({ format }).toString()}`, {
      headers: { Accept: 'application/octet-stream' }
    }),

  sendInvoice: (id: string) => 
    api.post<void>(`/invoices/${id}/send`),

  getPaymentHistory: (clientId: string) => 
    api.get<Array<{
      id: string;
      invoiceId: string;
      amount: number;
      date: string;
      method: string;
    }>>(`/clients/${clientId}/payments`),
  
  processPayment: (paymentData: { amount: number; clientId: string }) =>
    api.post<void>(`/payments`, paymentData),
  
  refundPayment: (paymentId: string) =>
    api.post<void>(`/payments/${paymentId}/refund`),
  
  getPaymentMethods: () =>
    api.get<Array<{
      id: string;
      name: string;
      type: string;
      details: Record<string, any>;
    }>>('/payment-methods'),
  
  addPaymentMethod: (data: { name: string; type: string; details: Record<string, any> }) =>
    api.post<void>('/payment-methods', data),
  
  updatePaymentMethod: (id: string, data: { name?: string; type?: string; details?: Record<string, any> }) =>
    api.put<void>(`/payment-methods/${id}`, data),
  
  deletePaymentMethod: (id: string) =>
    api.delete<void>(`/payment-methods/${id}`),
  
  getPaymentMethodById: (id: string) => 
    api.get<{ id: string; name: string; type: string; details: Record<string, any> }>(`/payment-methods/${id}`),

  processPaymentWithMethod: (paymentData: { amount: number; clientId: string; methodId: string }) =>
    api.post<void>(`/payments/process`, paymentData),
  
  refundPaymentWithMethod: (paymentId: string, methodId: string) =>
    api.post<void>(`/payments/${paymentId}/refund`, { methodId }),
  
  getPaymentHistoryByMethod: (methodId: string) =>
    api.get<Array<{
      id: string;
      invoiceId: string;
      amount: number;
      date: string;
      method: string;
    }>>(`/payment-methods/${methodId}/payments`),
  
  getPaymentMethodStats: (methodId: string) =>
    api.get<{
      totalRevenue: number;
      transactionCount: number;
      successfulCount: number;
      failedCount: number;
    }>(`/payment-methods/${methodId}/stats`),
  
  getPaymentMethodDetails: (methodId: string) =>
    api.get<{ id: string; name: string; type: string; details: Record<string, any> }>(`/payment-methods/${methodId}/details`),
  
  updatePaymentMethodDetails: (methodId: string, details: Record<string, any>) =>
    api.put<void>(`/payment-methods/${methodId}/details`, details),
  
  deletePaymentMethodDetails: (methodId: string) =>
    api.delete<void>(`/payment-methods/${methodId}/details`),
  
  getPaymentMethodTransactions: (methodId: string) => 
    api.get<Array<{ id: string; invoiceId: string; amount: number; date: string; method: string }>>(`/payment-methods/${methodId}/transactions`),
  
  getPaymentMethodTransactionById: (methodId: string, transactionId: string) => 
    api.get<{ id: string; invoiceId: string; amount: number; date: string; method: string }>(`/payment-methods/${methodId}/transactions/${transactionId}`),
  
  processPaymentWithMethodById: (methodId: string, paymentData: { amount: number; clientId: string }) =>
    api.post<void>(`/payment-methods/${methodId}/payments`, paymentData),
  
  refundPaymentWithMethodById: (methodId: string, paymentId: string) =>
    api.post<void>(`/payment-methods/${methodId}/payments/${paymentId}/refund`),
  
  getPaymentMethodTransactionHistory: (methodId: string, transactionId: string) =>    
    api.get<{ id: string; invoiceId: string; amount: number; date: string; method: string }>(`/payment-methods/${methodId}/transactions/${transactionId}/history`),

  getPaymentMethodTransactionStats: (methodId: string) => 
    api.get<{
      totalRevenue: number;
      transactionCount: number;
      successfulCount: number;
      failedCount: number;
    }>(`/payment-methods/${methodId}/transactions/stats`),
  
  getPaymentMethodTransactionSummary: (methodId: string) =>
    api.get<{
      totalRevenue: number;
      transactionCount: number;
      successfulCount: number;
      failedCount: number;
    }>(`/payment-methods/${methodId}/transactions/summary`),
  
  getPaymentMethodTransactionHistoryById: (methodId: string, transactionId: string) =>
    api.get<{ id: string; invoiceId: string; amount: number; date: string; method: string }>(`/payment-methods/${methodId}/transactions/${transactionId}/history`),
  
  getPaymentMethodTransactionDetailsById: (methodId: string, transactionId: string) =>  
    api.get<{ id: string; invoiceId: string; amount: number; date: string; method: string }>(`/payment-methods/${methodId}/transactions/${transactionId}/details`),
  
  getPaymentMethodTransactionStatsById: (methodId: string, transactionId: string) =>
    api.get<{
      totalRevenue: number;
      transactionCount: number;
      successfulCount: number;
      failedCount: number;
    }>(`/payment-methods/${methodId}/transactions/${transactionId}/stats`),
  
  getPaymentMethodTransactionSummaryById: (methodId: string, transactionId: string) =>
    api.get<{
      totalRevenue: number;
      transactionCount: number;
      successfulCount: number;
      failedCount: number;
    }>(`/payment-methods/${methodId}/transactions/${transactionId}/summary`)
}