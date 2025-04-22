
/**
 * Utility functions for Netlify Functions responses
 */

export function createSuccessResponse<T>(data: T) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}

export function createErrorResponse(error: unknown, statusCode = 500) {
  let message = "Internal Server Error";
  if (error instanceof Error) {
    message = error.message;
  }
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: message }),
  };
}
