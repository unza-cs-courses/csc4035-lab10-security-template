/**
 * Lab 10: Security Audit - Visible Test Suite
 * CSC4035 Web Programming and Technologies
 *
 * Run these tests locally with: npm test
 * Additional hidden tests will be used for final grading after the deadline.
 *
 * DO NOT MODIFY THIS FILE
 * Run with: npm test
 */

const http = require('http');

// Test counter
let passed = 0;
let failed = 0;

// Helper function to make HTTP requests
function makeRequest(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data ? JSON.parse(data) : null,
                        rawBody: data
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data,
                        rawBody: data
                    });
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

function test(name, fn) {
    return fn()
        .then(() => {
            console.log(`✓ ${name}`);
            passed++;
        })
        .catch((e) => {
            console.log(`✗ ${name}`);
            console.log(`  Error: ${e.message}`);
            failed++;
        });
}

function assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
    }
}

function assertTrue(value, message = '') {
    if (!value) {
        throw new Error(`Expected truthy value. ${message}`);
    }
}

function assertIncludes(str, substr, message = '') {
    if (!str || !str.includes(substr)) {
        throw new Error(`Expected "${str}" to include "${substr}". ${message}`);
    }
}

function assertNotIncludes(str, substr, message = '') {
    if (str && str.includes(substr)) {
        throw new Error(`Expected "${str}" NOT to include "${substr}". ${message}`);
    }
}

async function runTests() {
    console.log('\n========================================');
    console.log('Lab 10: Security Audit - Visible Tests');
    console.log('========================================\n');

    const baseOptions = {
        hostname: 'localhost',
        port: 3000,
        timeout: 5000
    };

    // Reset task model before tests
    const Task = require('../../models/Task');
    Task.reset();

    // Start the server
    console.log('Starting server...\n');
    const app = require('../../server');
    const server = app.listen(3000);

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Basic Functionality
        console.log('--- Basic Functionality ---');

        await test('API is running', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/health', method: 'GET' });
            assertEqual(res.statusCode, 200);
            assertEqual(res.body.status, 'healthy');
        });

        await test('Tasks API works', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/tasks', method: 'GET' });
            assertEqual(res.statusCode, 200);
            assertEqual(res.body.success, true);
        });

        // Security Headers (Task 3)
        console.log('\n--- Security Headers (Task 3) ---');

        await test('X-Content-Type-Options header is set', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/health', method: 'GET' });
            const header = res.headers['x-content-type-options'];
            assertEqual(header, 'nosniff', 'Should set X-Content-Type-Options: nosniff');
        });

        await test('X-Frame-Options header is set', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/health', method: 'GET' });
            const header = res.headers['x-frame-options'];
            assertTrue(header, 'Should set X-Frame-Options header');
        });

        await test('Content-Security-Policy header is set', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/health', method: 'GET' });
            const header = res.headers['content-security-policy'];
            assertTrue(header, 'Should set Content-Security-Policy header');
        });

        // Input Validation (Task 2)
        console.log('\n--- Input Validation (Task 2) ---');

        await test('POST /api/tasks validates title is required', async () => {
            const res = await makeRequest({
                ...baseOptions,
                path: '/api/tasks',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, { description: 'No title provided' });
            assertEqual(res.statusCode, 400);
            assertEqual(res.body.success, false);
        });

        await test('POST /api/tasks validates title length', async () => {
            const longTitle = 'a'.repeat(150);
            const res = await makeRequest({
                ...baseOptions,
                path: '/api/tasks',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, { title: longTitle });
            assertEqual(res.statusCode, 400);
            assertEqual(res.body.success, false);
        });

        await test('POST /api/tasks validates status values', async () => {
            const res = await makeRequest({
                ...baseOptions,
                path: '/api/tasks',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, { title: 'Test', status: 'invalid-status' });
            assertEqual(res.statusCode, 400);
            assertEqual(res.body.success, false);
        });

        // XSS Prevention (Task 6)
        console.log('\n--- XSS Prevention (Task 6) ---');

        await test('Secure greet endpoint escapes HTML', async () => {
            const xssAttempt = '<script>alert("XSS")</script>';
            const res = await makeRequest({
                ...baseOptions,
                path: `/api/secure/greet?name=${encodeURIComponent(xssAttempt)}`,
                method: 'GET'
            });
            assertEqual(res.statusCode, 200);
            // Check that script tags are escaped in response
            assertNotIncludes(res.rawBody, '<script>', 'Script tags should be escaped');
        });

        await test('Secure comment endpoint validates input', async () => {
            const res = await makeRequest({
                ...baseOptions,
                path: '/api/secure/comment',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, { author: '', comment: 'Test' });
            // Should either reject empty author or sanitize it
            assertTrue(res.statusCode === 400 || res.body.success === true);
        });

        await test('Secure comment endpoint sanitizes HTML', async () => {
            const res = await makeRequest({
                ...baseOptions,
                path: '/api/secure/comment',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, {
                author: 'Test<script>',
                comment: '<img onerror="alert(1)">'
            });
            if (res.statusCode === 200) {
                // If accepted, content should be sanitized
                assertNotIncludes(JSON.stringify(res.body), '<script');
                assertNotIncludes(JSON.stringify(res.body), 'onerror=');
            }
        });

        // Rate Limiting (Task 4)
        console.log('\n--- Rate Limiting (Task 4) ---');

        await test('Rate limit headers are present', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/health', method: 'GET' });
            // Check for rate limit headers
            const hasRateLimitHeaders =
                res.headers['x-ratelimit-limit'] ||
                res.headers['ratelimit-limit'] ||
                res.headers['x-ratelimit-remaining'];
            assertTrue(hasRateLimitHeaders, 'Rate limit headers should be present');
        });

        // Error Handling (Task 5)
        console.log('\n--- Error Handling (Task 5) ---');

        await test('404 errors return proper format', async () => {
            const res = await makeRequest({ ...baseOptions, path: '/api/nonexistent', method: 'GET' });
            assertEqual(res.statusCode, 404);
            assertEqual(res.body.success, false);
            assertTrue(res.body.error, 'Should have error message');
        });

    } finally {
        // Close the server
        server.close();
    }

    // Summary
    console.log('\n========================================');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log(`Score: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log('========================================\n');

    console.log('Note: This is your visible test score (40% of final grade).');
    console.log('Make sure all tests pass before pushing to GitHub.\n');

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
});
