export function calculateGrowthRate(current: number, previous: number): number {
  return ((current - previous) / previous) * 100;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculateHealthScore(metrics: number[]): number {
  return Math.round(metrics.reduce((sum, value) => sum + value, 0) / metrics.length);
}
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}
export function formatTime(time: string): string {
  return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}
export interface AnalyticsMetrics {
  totalUsers: number;
  newUsers: number;
  churnRate: number;
  activeUsers: number; // Added activeUsers property
}
export interface newUsers { // Added new interface  
  newUsers: number; // Added new property
  churnRate: number; // Added new property
  activeUsers: number; // Added new property
}
export interface RevenueMetrics {
  revenue: number;
  growth: number;
  transactions: number;
  }
  export interface UserMetrics {
    totalUsers: number;
    newUsers: number;
    churnRate: number;
    activeUsers: number;
  } 
//
// src/utils/analytics/metrics.ts
// src/utils/analytics/metrics.ts
// src/utils/analytics/metrics.ts

// This file defines a set of utility functions for formatting and calculating values.
// It includes functions for formatting numbers, currency, and time, as well as calculating growth rates and health scores.
// These utility functions can be used throughout the application to format and calculate various values.
// Path: src/utils/analytics/metrics.ts
// Compare this snippet from src/lib/supabase/types.ts:
//           due_date: string | null
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           title: string
//           description?: string | null
//           creator_id: string
//           assignee_id?: string | null      
//           due_date: string | null
//           created_at: string
//           updated_at: string
//         }
//         Update: {
//           id?: string
//           title?: string

//           description?: string | null
//           creator_id?: string
//           assignee_id?: string | null
//           due_date?: string | null
//           updated_at?: string
//         }
//       }
//       analytics: {
//         Row: {
//           id: string
//           user_id: string
//           task_id: string
//           created_at: string
//           updated_at: string
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           task_id: string


//           created_at?: string
//           updated_at?: string
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           task_id?: string
//           created_at?: string
//           updated_at?: string


//         }
//       }
//     }
//   }
// }
// Compare this snippet from src/utils/analytics/metrics.ts:
// // src/utils/analytics/metrics.ts
// import { Analytics } from './analytics';
//
// export function calculateGrowthRate(current: number, previous: number): number {
//   return ((current - previous) / previous) * 100;
// }
//
// export function formatPercentage(value: number): string {
//   return `${value.toFixed(1)}%`;
// }
//
// export function calculateHealthScore(metrics: number[]): number {    
//   const sum = metrics.reduce((a, b) => a + b, 0);
//   return Math.round(sum / metrics.length); // round to nearest integer
// }  
//
// export function formatCurrency(value: number): string {
//   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
// }
//
// export function formatNumber(value: number): string {
//   return new Intl.NumberFormat().format(value);
// }
//
// export function formatTime(time: string): string {
//   return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
// }
//
// export function formatDuration(duration: number): string {
//   const hours = Math.floor(duration / 60);
//   const minutes = duration % 60;
//   return `${hours}h ${minutes}m`;
// }
// Compare this snippet from src/services/api/consultationService.ts:
// // src/services/api/consultationService.ts
// import { api } from '../api';
// import type { Consultation } from '../../types';
//
// export const consultationService = {
//   async getConsultations() {
//     return await api.get<Consultation[]>('/consultations');
//   }
// }
