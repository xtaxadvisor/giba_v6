
import { Handler } from '@netlify/functions';
import { handleCors, getCorsHeaders } from './utils/cors';
import { createErrorResponse, createSuccessResponse } from './utils/response';

// Mock subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Essential tax and financial services',
    price: 29.99,
    interval: 'month',
    features: [
      'Basic Tax Consultation',
      'Document Storage',
      'Email Support',
      'Basic Tax Calculator'
    ]
  },
  {
    id: 'professional',
    name: 'Professional Plan',
    description: 'Advanced features for growing needs',
    price: 49.99,
    interval: 'month',
    features: [
      'Everything in Basic',
      'Priority Support',
      'Advanced Tax Planning',
      'Video Consultations',
      'Advanced Analytics'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'Complete solution for businesses',
    price: 99.99,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Dedicated Account Manager',
      'Custom Integrations',
      'Team Access',
      'API Access',
      'Custom Reports'
    ]
  }
];

export const handler: Handler = async (event) => {
  try {
    // Handle CORS
    const corsHeaders = handleCors(event);
    if ('statusCode' in corsHeaders) {
      return corsHeaders;
    }

    // Route handling
    switch (event.path) {
      case '/.netlify/functions/subscription/plans':
        return {
          ...createSuccessResponse(SUBSCRIPTION_PLANS),
          headers: corsHeaders
        };

      case '/.netlify/functions/subscription/subscribe':
        if (event.httpMethod !== 'POST') {
          return {
            ...createErrorResponse(405, 'Method not allowed'),
            headers: corsHeaders
          };
        }

        const { planId, paymentMethodId } = JSON.parse(event.body || '{}');
        
        // Mock subscription creation
        return {
          ...createSuccessResponse({
            id: `sub_${Date.now()}`,
            planId,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }),
          headers: corsHeaders
        };

      default:
        return {
          ...createErrorResponse(404, 'Not found'),
          headers: corsHeaders
        };
    }
  } catch (error) {
    console.error('Subscription error:', error);
    return {
      ...createErrorResponse(
        500,
        'Subscription processing failed',
        process.env.NODE_ENV === 'development' ? error : undefined
      ),
      headers: getCorsHeaders(event)
    };
  }
};
