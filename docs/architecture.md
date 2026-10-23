# CyberSentinel Architecture

## Overview

```
┌───────────────────────────┐
│       React Frontend      │
│   Security Operations UI  │
└─────────────┬─────────────┘
              │
          REST API + WebSocket
              │
┌─────────────▼─────────────┐
│      Django Backend       │
│   DRF + Django Channels   │
└─────────────┬─────────────┘
              │
 ┌────────────┼───────────────┐
 │            │               │
 ▼            ▼               ▼
PostgreSQL   Redis          Celery
Database    Queue/Cache     Workers
                              │
         ┌────────────────────┼──────────────┐
         │                    │              │
    Web/API Scanner     Log/Event         Threat
                         Analyzer          Intel
         │                    │              │
    OWASP ZAP            Detection       VirusTotal
                          Engine         AlienVault
```

## Services

| Service | Port | Description |
|---|---|---|
| Nginx | 80/443 | Reverse proxy |
| React | 5173 | Frontend dev server |
| Django | 8000 | REST API + WebSocket |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache + message broker |
| Celery Worker | — | Async task processing |
| Celery Beat | — | Scheduled tasks |
| OWASP ZAP | 8090 | Web security scanner |

## Data Flow

### Web Security Scan
```
User → POST /api/scans/ → Django → Celery Task → ZAP → Parse → Store → WebSocket → UI
```

### Security Event
```
Application → POST /api/events/ → Django → Detection Engine → Alert → Incident
```

### Threat Intelligence
```
IOC → Django → VirusTotal/AlienVault → Normalize → Store → Display
```

## Django Apps

| App | Purpose |
|---|---|
| accounts | User management, RBAC, JWT auth |
| organizations | Multi-tenant organization management |
| assets | Asset registry (apps, APIs, servers, domains) |
| scans | Web & API security scans |
| vulnerabilities | Vulnerability lifecycle management |
| security_events | SIEM event ingestion |
| detection | Detection rules & alert engine |
| incidents | Incident response workflow |
| threat_intelligence | IOC lookup & threat intel |
| risk | Risk scoring engine |
| reports | Report generation |
| devsecops | CI/CD security integration |
| ai_analyst | AI-powered security analysis |
| audit | Immutable audit log |
| notifications | Notification system |

## Security Architecture

- JWT authentication with refresh token rotation
- RBAC with roles: SUPER_ADMIN, SECURITY_ADMIN, SECURITY_ANALYST, DEVELOPER, VIEWER
- All API endpoints permission-checked
- Django Channels for real-time WebSocket events
- Celery for all async security operations
- OWASP ZAP in isolated Docker container
