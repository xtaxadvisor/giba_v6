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

    // Parse and validate audit log data
    const logData = JSON.parse(event.body || '{}');
    
    // Store audit log (implement your storage logic here)
    console.log('Audit log:', logData);

    return {
      ...createSuccessResponse({ success: true }),
      headers: corsHeaders
    };

  } catch (error) {
    console.error('Audit log error:', error);
    return {
      ...createErrorResponse(
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Failed to store audit log',
        500
      ),
      headers: getCorsHeaders(event)
    };
  }
};