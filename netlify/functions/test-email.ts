import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { handleCors, getCorsHeaders } from './utils/cors';
import { createErrorResponse, createSuccessResponse } from './utils/response';

export const handler = async (event) => {
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

    // Configure AWS SES
    if (!process.env.VITE_AWS_REGION || !process.env.VITE_AWS_SMTP_USERNAME || !process.env.VITE_AWS_SMTP_PASSWORD) {
      throw new Error('Missing required AWS SES environment variables');
    }

    const ses = new SESClient({
      region: process.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: process.env.VITE_AWS_SMTP_USERNAME,
        secretAccessKey: process.env.VITE_AWS_SMTP_PASSWORD
      }
    });

    // Test SES configuration
    const command = new SendEmailCommand({
      Source: process.env.VITE_AWS_SMTP_FROM,
      Destination: {
        ToAddresses: [process.env.VITE_AWS_SMTP_FROM || (() => { throw new Error('VITE_AWS_SMTP_FROM is not defined'); })()]
      },
      Message: {
        Subject: { Data: 'Test Email' },
        Body: { Text: { Data: 'This is a test email.' } }
      }
    });

    await ses.send(command);

    return {
      ...createSuccessResponse({ 
        success: true,
        message: 'Email service configuration valid'
      }),
      headers: corsHeaders
    };

  } catch (error) {
    console.error('Email test error:', error);
    return {
        ...createErrorResponse(
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Email service test failed',
        500
      ),
      headers: getCorsHeaders(event)
    };
  }
};