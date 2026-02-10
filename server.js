/**
 * Lab 10: Security Audit
 * CSC4035 Web Programming and Technologies
 *
 * VULNERABLE APPLICATION - FIX THE SECURITY ISSUES!
 *
 * This server intentionally contains security vulnerabilities.
 * Your task is to identify and fix them.
 *
 * Run with: npm start
 * Test with: npm test
 */

const express = require('express');
const path = require('path');

// TODO: Import and configure Helmet for security headers
// const helmet = require('helmet');

// TODO: Import and configure rate limiter
// const rateLimit = require('express-rate-limit');

// Import routes
const taskRoutes = require('./routes/tasks');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

// TODO: Import security middleware from ./middleware/security
// const { sanitizeInput } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// TASK 3: Security Headers with Helmet
// ============================================

// TODO: Configure and use Helmet middleware
// Helmet helps secure Express apps by setting various HTTP headers
// Configure the following:
// - Content-Security-Policy: Restrict content sources
// - HSTS: Enforce HTTPS
// - X-Content-Type-Options: Prevent MIME sniffing
// - X-Frame-Options: Prevent clickjacking
// - X-XSS-Protection: Enable XSS filter
//
// Example:
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'"],
//             styleSrc: ["'self'", "'unsafe-inline'"],
//             imgSrc: ["'self'", "data:"],
//         }
//     }
// }));


// ============================================
// TASK 4: Rate Limiting
// ============================================

// TODO: Create a general rate limiter
// Limit: 100 requests per 15 minutes
// Message: "Too many requests, please try again later"
//
// const generalLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100,
//     message: { success: false, error: 'Too many requests, please try again later' }
// });


// TODO: Create a strict rate limiter for sensitive operations
// Limit: 10 requests per hour
// Apply to: POST, PUT, DELETE routes
//
// const strictLimiter = rateLimit({
//     windowMs: 60 * 60 * 1000, // 1 hour
//     max: 10,
//     message: { success: false, error: 'Rate limit exceeded for sensitive operations' }
// });


// TODO: Apply general rate limiter to all routes
// app.use(generalLimiter);


// ============================================
// Middleware Setup
// ============================================

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// TODO: Apply input sanitization middleware to all routes
// app.use(sanitizeInput);


// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================
// Routes
// ============================================

// Root route - API information
app.get('/', (req, res) => {
    res.json({
        name: 'Lab 10: Security Audit',
        version: '1.0.0',
        description: 'Task Management API - Security Hardened',
        endpoints: {
            tasks: '/api/tasks'
        }
    });
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

// Mount task routes
app.use('/api/tasks', taskRoutes);


// ============================================
// VULNERABLE ENDPOINT - DO NOT USE IN PRODUCTION
// This endpoint demonstrates XSS vulnerability
// ============================================

// VULNERABILITY: This endpoint reflects user input without sanitization
// This is intentionally vulnerable for demonstration purposes
app.get('/api/vulnerable/greet', (req, res) => {
    const name = req.query.name || 'Guest';

    // VULNERABILITY: Direct reflection of user input
    // This allows XSS attacks if rendered in HTML
    // Example attack: /api/vulnerable/greet?name=<script>alert('XSS')</script>

    res.json({
        message: `Hello, ${name}!`,
        warning: 'This endpoint is intentionally vulnerable for demonstration'
    });
});

// VULNERABILITY: This endpoint doesn't validate input
app.post('/api/vulnerable/comment', (req, res) => {
    const { author, comment } = req.body;

    // VULNERABILITY: No input validation or sanitization
    // Malicious scripts could be stored and executed later

    res.json({
        success: true,
        data: {
            author: author,
            comment: comment,
            warning: 'This endpoint stores unsanitized input'
        }
    });
});


// ============================================
// TASK 6: XSS Prevention - Secure Endpoints
// ============================================

// TODO: Create a secure version of the greet endpoint
// GET /api/secure/greet?name=Alice
// - Sanitize the name input to prevent XSS
// - Escape HTML special characters
app.get('/api/secure/greet', (req, res) => {
    const name = req.query.name || 'Guest';

    // TODO: Sanitize the name input before using it
    // Hint: Use the escapeHtml function from ./middleware/security
    // const sanitizedName = escapeHtml(name);

    res.json({
        message: `Hello, ${name}!` // TODO: Use sanitizedName instead
    });
});

// TODO: Create a secure version of the comment endpoint
// POST /api/secure/comment
// - Validate author (required, string, max 50 chars)
// - Validate comment (required, string, max 500 chars)
// - Sanitize both inputs
app.post('/api/secure/comment', (req, res) => {
    const { author, comment } = req.body;

    // TODO: Validate and sanitize inputs
    // YOUR CODE HERE

    res.json({
        success: true,
        data: {
            author: author,  // TODO: Use sanitized author
            comment: comment // TODO: Use sanitized comment
        }
    });
});


// ============================================
// Error Handling
// ============================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);


// ============================================
// Server Start
// ============================================

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Security Lab API running on http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop');
    });
}

module.exports = app;
