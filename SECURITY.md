# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | ✅        |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email: security@cybersentinel.io

We will respond within 48 hours.

## Security Architecture

- All API endpoints require JWT authentication
- Role-Based Access Control (RBAC) enforced at API layer
- Passwords hashed with Argon2
- JWT tokens with short expiry + refresh token rotation
- All scans run in isolated Celery workers
- Scanner targets must be explicitly authorized
- No destructive operations on third-party systems
- All user actions recorded in audit log
- Secrets managed via environment variables only
- HTTPS enforced in production
- CORS policy configured per environment
- Rate limiting on all public endpoints
- SQL injection prevention via Django ORM
- XSS prevention via React and CSP headers

## Responsible Use

CyberSentinel is a security testing platform. Users are responsible for:

1. Only scanning systems they own or have explicit written permission to test
2. Complying with applicable laws and regulations
3. Not using the platform for offensive or unauthorized security testing
4. Reporting vulnerabilities responsibly

## Data Handling

- Security event data is stored encrypted at rest
- Sensitive fields (API keys, secrets) are never stored in plaintext
- Audit logs are immutable
- Data retention configurable per organization
