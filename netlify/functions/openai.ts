import { Handler } from '@netlify/functions';
import { OpenAI } from 'openai';
import { handleCors, getCorsHeaders } from './utils/cors';
import { createErrorResponse, createSuccessResponse } from './utils/response';

// Initialize OpenAI with error handling
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

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

    // Parse and validate request body
    if (!event.body) {
      return {
        ...createErrorResponse('Request body is required', 400),
        headers: corsHeaders
      };
    }

    const { content, context = 'visitor', messages = [] } = JSON.parse(event.body);
    
    if (!content) {
      return {
        ...createErrorResponse('Content is required', 400),
        headers: corsHeaders
      };
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: `You are a helpful AI assistant for ProTaXAdvisors, focusing on tax and financial advisory services. Context: ${context}`
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    });

    // Return success response
    return {
      ...createSuccessResponse({
        id: completion.id,
        object: completion.object,
        created: completion.created,
        model: completion.model,
        response: completion.choices[0]?.message?.content || 'No response generated'
      }),
      headers: corsHeaders
    };

  } catch (error) {
    console.error('OpenAI error:', error);
    
    // Return appropriate error response
    return {
      ...createErrorResponse(
        error.response?.data?.error?.message || 'Failed to get AI response',
        error.response?.status || 500
      ),
      headers: getCorsHeaders(event)
    };
  }
};