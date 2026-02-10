# Lab 10: Security Audit and Course Integration

**Course:** CSC4035 Web Programming and Technologies
**Estimated Time:** 2.5-3 hours
**Weight:** 1% of final grade

---

## Purpose

This final lab brings together all course concepts by conducting a security audit of an API and implementing security fixes. You will identify vulnerabilities, apply protective measures, and demonstrate understanding of web security principles. This prepares you for both the final exam and professional development practices.

---

## Learning Outcomes

By completing this lab, you will be able to:

1. Identify common web security vulnerabilities (XSS, injection)
2. Implement input validation and sanitization
3. Apply secure coding practices to existing code
4. Configure security headers and middleware
5. Document security measures and their purposes

---

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Run tests:
   ```bash
   npm test
   ```

---

## Project Structure

```
csc4035-lab10-security-template/
├── server.js                    # Main server (contains vulnerabilities to fix)
├── models/
│   └── Task.js                  # Task model (provided)
├── controllers/
│   └── taskController.js        # Task controller (provided)
├── routes/
│   └── tasks.js                 # Task routes (add security middleware)
├── middleware/
│   ├── security.js              # Security middleware (implement this)
│   └── errorHandler.js          # Error handling (improve for security)
├── public/
│   └── index.html               # API documentation page
├── tests/
│   └── visible/
│       └── tests.js             # Security tests
├── audit-report.md              # Complete this security audit report
└── screenshots/                 # Add test screenshots here
```

---

## Tasks

### Task 1: Vulnerability Assessment (30 minutes)

Review the application code and complete `audit-report.md`:
- Identify XSS vulnerabilities
- Find missing input validation
- Note missing security headers
- Document insecure error handling

### Task 2: Input Validation Fixes (25 minutes)

Complete `middleware/security.js`:
- `escapeHtml()` - Escape HTML special characters
- `sanitizeInput()` - Sanitize request body
- `validateTaskInput()` - Validate task data
- `validateIdParam()` - Validate ID parameters

### Task 3: Security Headers with Helmet (20 minutes)

Configure Helmet.js in `server.js`:
- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### Task 4: Rate Limiting (15 minutes)

Implement rate limiting in `server.js`:
- General: 100 requests per 15 minutes
- Strict: 10 requests per hour for sensitive operations (POST, PUT, DELETE)

### Task 5: Error Handling Improvements (20 minutes)

Update error handling for environment awareness:
- Development: Show detailed errors
- Production: Show generic messages (no stack traces)

### Task 6: XSS Prevention (15 minutes)

Fix the vulnerable endpoints:
- `/api/secure/greet` - Sanitize query parameter
- `/api/secure/comment` - Validate and sanitize body

### Task 7: Security Testing (20 minutes)

Test your implementations:
1. Attempt XSS attacks (should be blocked)
2. Test rate limiting (should throttle requests)
3. Send invalid input (should be rejected)
4. Verify security headers (should be present)

---

## Vulnerability Types to Fix

### 1. Cross-Site Scripting (XSS)

**Problem:** User input reflected without escaping
```javascript
// VULNERABLE
const name = req.query.name;
res.json({ message: `Hello, ${name}!` });
```

**Solution:** Escape HTML special characters
```javascript
// SECURE
const name = escapeHtml(req.query.name);
res.json({ message: `Hello, ${name}!` });
```

### 2. Missing Input Validation

**Problem:** No validation of user input
```javascript
// VULNERABLE
const { title } = req.body;
Task.create({ title });
```

**Solution:** Validate before processing
```javascript
// SECURE
if (!title || typeof title !== 'string' || title.length > 100) {
    return res.status(400).json({ error: 'Invalid title' });
}
```

### 3. Missing Security Headers

**Problem:** No security headers set
**Solution:** Use Helmet.js middleware
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 4. No Rate Limiting

**Problem:** API can be abused with unlimited requests
**Solution:** Use express-rate-limit
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
```

---

## Testing Security

### Test XSS Prevention

```bash
# Should escape script tags
curl "http://localhost:3000/api/secure/greet?name=<script>alert('XSS')</script>"

# Response should contain escaped HTML, not executable script
```

### Test Rate Limiting

```bash
# Make many requests quickly
for i in {1..20}; do curl http://localhost:3000/api/tasks; done

# Should eventually return 429 Too Many Requests
```

### Test Input Validation

```bash
# Should be rejected (title too long)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "'$(python3 -c "print('a'*200))'"}'

# Should return 400 Bad Request
```

### Check Security Headers

```bash
curl -I http://localhost:3000/api/health

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Content-Security-Policy: ...
```

---

## Grading

| Component | Weight |
|-----------|--------|
| Visible Tests | 40% |
| Hidden Tests | 30% |
| Audit Report | 20% |
| Academic Integrity | -10% if flagged |

### Visible Tests

Tests cover:
- Security headers present
- Input validation working
- XSS prevention
- Rate limiting configured

### Hidden Tests

Additional tests cover:
- Edge cases
- Advanced XSS vectors
- Bypass attempts
- Complete security coverage

---

## Submission

1. Complete all security implementations
2. Fill out `audit-report.md`
3. Ensure `npm test` passes
4. Add screenshots to `screenshots/` folder
5. Commit and push

```bash
git add .
git commit -m "Complete Lab 10"
git push
```

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## Academic Integrity

- **Allowed:** OWASP documentation, security best practices guides
- **Allowed:** Discussing security concepts with classmates
- **NOT Allowed:** Copying security configurations without understanding
- **NOT Allowed:** Using AI to generate solutions

You must be able to explain each security measure you implement.

All submissions are checked with plagiarism detection tools.
