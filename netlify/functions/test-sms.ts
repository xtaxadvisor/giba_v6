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

    // Validate authorization
    const authHeader = event.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        ...createErrorResponse('Unauthorized', 401),
        headers: corsHeaders
      };
    }

    // Test Twilio configuration
    const TWILIO_CONFIG = {
      accountSid: process.env.VITE_TWILIO_ACCOUNT_SID,
      authToken: process.env.VITE_TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.VITE_TWILIO_PHONE_NUMBER
    };

    // Validate configuration
    if (!TWILIO_CONFIG.accountSid || !TWILIO_CONFIG.authToken || !TWILIO_CONFIG.phoneNumber) {
      throw new Error('SMS service not properly configured');
    }

    // Return success if configuration is valid
    return {
      ...createSuccessResponse({ 
        success: true,
        message: 'SMS service configuration valid',
        config: {
          accountSid: TWILIO_CONFIG.accountSid,
          phoneNumber: TWILIO_CONFIG.phoneNumber
        }
      }),
      headers: corsHeaders
    };

  } catch (error) {
    console.error('SMS test error:', error);
    return {
        ...createErrorResponse(
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'SMS service test failed',
        500
      ),
      headers: getCorsHeaders(event)
    };
  }
};