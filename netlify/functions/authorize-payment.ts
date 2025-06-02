import { Handler } from '@netlify/functions';
import { handleCors, getCorsHeaders } from './utils/cors';
import { createErrorResponse, createSuccessResponse } from './utils/response';

export const handler: Handler = async (event) => {
  try {
    // Handle CORS
    const corsHeaders = handleCors(event);
    if ('statusCode' in corsHeaders) {
      return corsHeaders;
    }

    // Validate request method
    if (event.httpMethod !== 'POST') {
      return {
        ...createErrorResponse('Method not allowed', 405),
        headers: corsHeaders
      };
    }

    // Parse payment data
    const paymentData = JSON.parse(event.body || '{}');
    
    // Validate login ID
    if (paymentData.loginId !== '5S35UDg3cec8') {
      return {
        ...createErrorResponse('Invalid credentials', 401),
        headers: corsHeaders
      };
    }

    // Process payment (implement actual Authorize.net API call here)
    const transactionId = `mock_${Date.now()}`;

    return {
      ...createSuccessResponse({
        success: true,
        transactionId,
        message: 'Payment processed successfully'
      }),
      headers: corsHeaders
    };

  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      ...createErrorResponse(
        'Payment processing failed',
        500
      ),
      headers: getCorsHeaders(event)
    };
  }
};