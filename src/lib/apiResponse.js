import { NextResponse } from 'next/server'

/**
 * Standardized API response utilities
 * Ensures consistent response format across all API routes
 */

/**
 * Success response
 * @param {*} data - Response data
 * @param {string} message - Optional success message
 * @param {number} status - HTTP status code (default: 200)
 */
export function successResponse(data, message = null, status = 200) {
  const response = {
    success: true,
    data
  }
  
  if (message) {
    response.message = message
  }
  
  return NextResponse.json(response, { status })
}

/**
 * Error response
 * @param {string} error - Error message
 * @param {string} code - Error code (optional)
 * @param {number} status - HTTP status code (default: 400)
 */
export function errorResponse(error, code = null, status = 400) {
  const response = {
    success: false,
    error
  }
  
  if (code) {
    response.code = code
  }
  
  return NextResponse.json(response, { status })
}

/**
 * Unauthorized response (401)
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 'UNAUTHORIZED', 401)
}

/**
 * Forbidden response (403)
 */
export function forbiddenResponse(message = 'Forbidden') {
  return errorResponse(message, 'FORBIDDEN', 403)
}

/**
 * Not found response (404)
 */
export function notFoundResponse(message = 'Resource not found') {
  return errorResponse(message, 'NOT_FOUND', 404)
}

/**
 * Validation error response (422)
 */
export function validationErrorResponse(errors, message = 'Validation failed') {
  return NextResponse.json({
    success: false,
    error: message,
    code: 'VALIDATION_ERROR',
    errors
  }, { status: 422 })
}

/**
 * Server error response (500)
 */
export function serverErrorResponse(message = 'Internal server error') {
  return errorResponse(message, 'SERVER_ERROR', 500)
}

/**
 * Created response (201)
 */
export function createdResponse(data, message = 'Resource created successfully') {
  return successResponse(data, message, 201)
}

/**
 * No content response (204)
 */
export function noContentResponse() {
  return new NextResponse(null, { status: 204 })
}
