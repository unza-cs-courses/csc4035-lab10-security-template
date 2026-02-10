/**
 * Lab 10: Security Middleware
 * CSC4035 Web Programming and Technologies
 *
 * Implement security middleware to protect the API.
 *
 * Complete all the TODO sections.
 */

// ============================================
// TASK 2: Input Validation and Sanitization
// ============================================

/**
 * Escape HTML special characters to prevent XSS
 * Characters to escape: & < > " ' /
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return str;

    // TODO: Replace HTML special characters with their entity equivalents
    // & -> &amp;
    // < -> &lt;
    // > -> &gt;
    // " -> &quot;
    // ' -> &#x27;
    // / -> &#x2F;
    //
    // Hint: Use String.replace() with a regular expression
    // or chain multiple replace() calls
    //
    // YOUR CODE HERE

    return str; // TODO: Return the escaped string
}

/**
 * Sanitize all string values in an object
 * Recursively escapes HTML in all string properties
 *
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' ? escapeHtml(obj) : obj;
    }

    // TODO: Iterate through object properties
    // For each string value, apply escapeHtml
    // For nested objects, recursively call sanitizeObject
    //
    // YOUR CODE HERE

    return obj; // TODO: Return the sanitized object
}

/**
 * Middleware to sanitize request body
 * Applies HTML escaping to all string values in req.body
 */
function sanitizeInput(req, res, next) {
    // TODO: Sanitize req.body if it exists
    // Use the sanitizeObject function
    //
    // YOUR CODE HERE

    next();
}

/**
 * Validate task input data
 * Validates title, description, status, and priority
 *
 * Requirements:
 * - title: required, string, 1-100 characters
 * - description: optional, string, max 500 characters
 * - status: optional, must be 'pending', 'in-progress', or 'completed'
 * - priority: optional, must be 'low', 'medium', or 'high'
 */
function validateTaskInput(req, res, next) {
    const { title, description, status, priority } = req.body;

    // TODO: Validate title
    // - Required
    // - Must be a string
    // - Length between 1 and 100 characters
    // Return 400 with error message if invalid
    //
    // YOUR CODE HERE


    // TODO: Validate description if provided
    // - Must be a string
    // - Max 500 characters
    //
    // YOUR CODE HERE


    // TODO: Validate status if provided
    // - Must be one of: 'pending', 'in-progress', 'completed'
    //
    // YOUR CODE HERE


    // TODO: Validate priority if provided
    // - Must be one of: 'low', 'medium', 'high'
    //
    // YOUR CODE HERE


    next();
}

/**
 * Validate ID parameter
 * Ensures the ID is a valid non-empty string
 */
function validateIdParam(req, res, next) {
    const { id } = req.params;

    // TODO: Validate id parameter
    // - Must exist
    // - Must be a non-empty string
    // Return 400 with error message if invalid
    //
    // YOUR CODE HERE


    next();
}

/**
 * Validate query parameters for XSS attempts
 * Checks for common XSS patterns in query strings
 */
function validateQueryParams(req, res, next) {
    // Common XSS patterns to detect
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
    ];

    // TODO: Check each query parameter value against XSS patterns
    // If a pattern is found, return 400 with error message
    //
    // YOUR CODE HERE


    next();
}


// ============================================
// TASK 5: Environment-Aware Error Handling
// ============================================

/**
 * Create a sanitized error response
 * In production: returns generic message
 * In development: returns detailed error
 *
 * @param {Error} err - The error object
 * @param {boolean} isDev - Is development environment
 * @returns {Object} Error response object
 */
function createErrorResponse(err, isDev) {
    // TODO: Return appropriate error response based on environment
    // Development: include error message and stack trace
    // Production: generic "Internal server error" message
    //
    // YOUR CODE HERE

    return {
        success: false,
        error: 'Internal server error'
    };
}


module.exports = {
    escapeHtml,
    sanitizeObject,
    sanitizeInput,
    validateTaskInput,
    validateIdParam,
    validateQueryParams,
    createErrorResponse
};
