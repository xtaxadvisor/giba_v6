import { Handler } from '@netlify/functions';
import { handleCors, getCorsHeaders } from './utils/cors';
import { createErrorResponse, createSuccessResponse } from './utils/response';
import Configuration, { OpenAI } from 'openai';

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

    // Test OpenAI configuration
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Test API connection
    const response = await openai.models.list();
    
    return {
      ...createSuccessResponse({ 
        success: true,
        message: 'OpenAI service connection successful'
      }),
      headers: corsHeaders
    };

  } catch (error) {
    console.error('OpenAI test error:', error);
    return {
      ...createErrorResponse(
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'OpenAI service test failed',
        500
      ),
      headers: getCorsHeaders(event)
    };
  }
};