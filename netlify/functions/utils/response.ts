// utils/response.ts

export function createSuccessResponse<T>(data: T, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify({ data }),
  };
}

export function createErrorResponse(message: string, statusCode = 500) {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  };
}
