export const ServiceTypeKeys = {
  Basic: 'basic',
  Premium: 'premium',
  Enterprise: 'enterprise',
  TAX_PLANNING: 'tax_planning',
  FINANCIAL_REVIEW: 'financial_review',
  INVESTMENT_ADVISORY: 'investment_advisory',
  BUSINESS_CONSULTING: 'business_consulting',
  TAX_PREPARATION: 'tax_preparation',
} as const;

export type ServiceType = typeof ServiceTypeKeys[keyof typeof ServiceTypeKeys];
// Ensure calculateServicesCost is defined and exported
// Define or import the ServiceRequest type
export interface ServiceRequest {
  serviceType: ServiceType;
  quantity: number;
  hours: number;
  addons: Addon[]; // Define Addon type if missing
    
}
// Add the definition and export of AddonBreakdown if missing
export interface AddonBreakdown {
  name: string;
  quantity: number;
  total: number; 
}
// Removed duplicate declaration of ServiceType to avoid redeclaration error

// Define the Addon type if it is missing
export interface Addon {
  name: string;
  price: number;
  quantity?: number; 
  breakdown?: AddonBreakdown;
  }


  


export function calculateServicesCost(services: ServiceRequest[]): any {
  // Implementation of the function
}