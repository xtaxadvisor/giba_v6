/// <reference types="node" />
import { Handler } from '@netlify/functions';
import { handleCors, getCorsHeaders } from './utils/cors';
import { validateCredentials, generateToken, createAdminUser } from './utils/auth';
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

    // Validate authorization header
    const authHeader = event.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        ...createErrorResponse('Missing or invalid authorization', 401),
        headers: corsHeaders
      };
    }

    // Parse and validate request body
    let username: string, password: string;
    try {
      const body = JSON.parse(event.body || '{}');
      username = body.username;
      password = body.password;

      if (!username || !password) {
        throw new Error('Missing credentials');
      }
    } catch (error) {
      return {
        ...createErrorResponse('Invalid request body', 400),
        headers: corsHeaders
      };
    }

    // Validate credentials
    const isValid = await validateCredentials(username, password);
    if (!isValid) {
      return {
        ...createErrorResponse('Invalid credentials', 401),
        headers: corsHeaders
      };
    }

    // Create admin user and generate token
    const user = createAdminUser();
    const token = await generateToken(user);

    // Return success response
    return {
      ...createSuccessResponse({ token, user }),
      headers: corsHeaders
    };

  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV !== 'production') {
      console.error('Admin auth error:', error);
    }

    return {
        ...createErrorResponse(
        process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        500
      ),
      headers: getCorsHeaders(event)
    };
  }
};