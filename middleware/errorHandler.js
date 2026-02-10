/**
 * Lab 10: Error Handling Middleware
 * CSC4035 Web Programming and Technologies
 *
 * Centralized error handling for the API.
 */

const { createErrorResponse } = require('./security');

/**
 * 404 Not Found handler
 */
function notFound(req, res, next) {
    res.status(404).json({
        success: false,
        error: 'Not found',
        path: req.originalUrl
    });
}

/**
 * Global error handler
 * Uses environment-aware error responses
 */
function errorHandler(err, req, res, next) {
    // Log error for debugging
    console.error('Error:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error('Stack:', err.stack);
    }

    // Determine status code
    const statusCode = err.statusCode || 500;

    // Use the createErrorResponse function for consistent error handling
    const isDev = process.env.NODE_ENV !== 'production';
    const response = createErrorResponse(err, isDev);

    res.status(statusCode).json(response);
}

module.exports = {
    notFound,
    errorHandler
};
