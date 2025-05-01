export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  currency?: 'USD' | 'EUR' | 'BRL';
  trialEnd?: string;
  graceUntil?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}
