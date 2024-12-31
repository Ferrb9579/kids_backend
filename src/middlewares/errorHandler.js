// src/middlewares/errorHandler.js

/**
 * A custom Error class for operational (expected) errors.
 * You can throw this in your controllers for any known issues
 * like "User not found", "Validation failed," etc.
 */
export class AppError extends Error {
    constructor(message, statusCode, errorCode = 'APP_ERROR') {
      super(message);
      this.statusCode = statusCode;
      this.errorCode = errorCode; 
      this.isOperational = true; // Mark this as an operational error
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * The global error-handling middleware:
   * - Format all errors in a consistent JSON structure
   * - Hide stack traces in production
   */
  export const globalErrorHandler = (err, req, res, next) => {
    // If it's a known operational error (our custom "AppError")
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: 'fail',
        errorCode: err.errorCode,
        message: err.message,
      });
    }
  
    // Otherwise, it's an unknown or programming error
    console.error('UNEXPECTED ERROR:', err);
  
    return res.status(500).json({
      status: 'error',
      errorCode: 'SERVER_ERROR',
      message: 'Something went wrong on our end. Please try again later.',
    });
  };
  