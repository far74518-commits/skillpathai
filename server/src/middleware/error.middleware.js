import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  let error = err;

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = new ApiError(400, 'Validation Error', formattedErrors);
  }
  // Handle Mongoose Bad ObjectId (CastError)
  else if (err.name === 'CastError') {
    error = new ApiError(400, `Resource not found with id: ${err.value}`);
  }
  // Handle Mongoose duplicate key error (code 11000)
  else if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(409, `An entry with this ${field} already exists.`);
  }
  // Handle Mongoose ValidationError
  else if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    error = new ApiError(400, 'Validation Error', messages);
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  } else if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Your token has expired. Please log in again.');
  }
  // Generic unhandled Error
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || [],
  };

  if (error.statusCode >= 500 && error.stack) {
    console.error('[Internal Error Stack]', error.stack);
  }

  res.status(error.statusCode || 500).json(response);
}

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Endpoint not found: ${req.method} ${req.originalUrl}`));
}
