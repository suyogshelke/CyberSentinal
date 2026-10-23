# CyberSentinel API Reference

CyberSentinel provides a comprehensive RESTful API and WebSocket interface for cybersecurity operations, vulnerability management, SIEM event ingestion, threat intelligence enrichment, and real-time security alerts.

---

## Base URLs

- **REST API Base URL:** `http://localhost:8000/api/` (or your domain `/api/`)
- **WebSocket Base URL:** `ws://localhost:8000/ws/`
- **Interactive Swagger UI:** `http://localhost:8000/api/docs/`
- **ReDoc UI:** `http://localhost:8000/api/redoc/`
- **OpenAPI Schema:** `http://localhost:8000/api/schema/`

---

## Authentication

All API endpoints (except login, register, and health check) require a Bearer JWT Token in the request header:

```http
Authorization: Bearer <your_jwt_access_token>
```

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register a new user |
| `POST` | `/api/auth/login/` | Obtain access & refresh JWT tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh expired access token |
| `GET` | `/api/auth/me/` | Get current authenticated user profile |
| `POST` | `/api/auth/change-password/` | Change account password |

---

## Core API Endpoints

### 1. Dashboard & Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health/` | Service health status check |
| `GET` | `/api/dashboard/stats/` | Overview security metrics & counts |
| `GET` | `/api/dashboard/summary/` | Aggregated executive security posture |

### 2. Assets Registry (`/api/assets/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assets/` | List monitored assets (web, API, server, IP, domain) |
| `POST` | `/api/assets/` | Register a new asset |
| `GET` | `/api/assets/{id}/` | Retrieve asset details & risk score |
| `PUT/PATCH` | `/api/assets/{id}/` | Update asset configuration |
| `DELETE` | `/api/assets/{id}/` | Remove asset |

### 3. Web & API Scans (`/api/scans/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scans/` | List past and active security scans |
| `POST` | `/api/scans/` | Trigger new scan (OWASP ZAP, header, TLS, CORS) |
| `GET` | `/api/scans/{id}/` | Get scan progress, status & discovered findings |
| `POST` | `/api/scans/{id}/stop/` | Abort a running security scan |

### 4. Vulnerabilities (`/api/vulnerabilities/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vulnerabilities/` | Filter vulnerabilities by severity, status, asset |
| `POST` | `/api/vulnerabilities/` | Log a manual vulnerability finding |
| `GET` | `/api/vulnerabilities/{id}/` | Full CVE/CWE details, CVSS, remediation advice |
| `PATCH` | `/api/vulnerabilities/{id}/` | Update status (Open, In Progress, Resolved, False Positive) |

### 5. SIEM & Security Events (`/api/events/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events/` | Query ingested security events with filtering |
| `POST` | `/api/events/` | Ingest log/event from external systems |
| `GET` | `/api/events/{id}/` | Detailed event raw payload and parsed taxonomy |

### 6. Detection & Rules (`/api/detection/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/detection/rules/` | List active anomaly & threat detection rules |
| `POST` | `/api/detection/rules/` | Create custom detection rule |
| `GET` | `/api/detection/alerts/` | List triggered security alerts |

### 7. Incident Response (`/api/incidents/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/incidents/` | List security incidents |
| `POST` | `/api/incidents/` | Create incident ticket |
| `GET` | `/api/incidents/{id}/` | Incident timeline, evidence, assigned analysts |
| `PATCH` | `/api/incidents/{id}/` | Transition incident workflow status |

### 8. Threat Intelligence (`/api/threat-intelligence/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/threat-intelligence/lookup/` | Query IP, domain, hash against VirusTotal, AlienVault OTX, AbuseIPDB |
| `GET` | `/api/threat-intelligence/indicators/` | Cached local IOCs and threat scores |

### 9. AI Security Analyst (`/api/ai-analyst/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai-analyst/analyze/` | AI-assisted explanation of vulnerability / log finding |
| `POST` | `/api/ai-analyst/remediation/` | Generate step-by-step remediation guide |

### 10. DevSecOps Integration (`/api/devsecops/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/devsecops/pipeline-scan/` | CI/CD webhook for Bandit, Semgrep, Trivy, Checkov scan ingest |
| `GET` | `/api/devsecops/pipelines/` | List pipeline security audit runs |

### 11. Reports & Audit (`/api/reports/` & `/api/audit/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports/` | List generated compliance and technical reports |
| `POST` | `/api/reports/generate/` | Generate PDF, CSV, or JSON security report |
| `GET` | `/api/audit/` | Immutable audit trail of administrative and analyst actions |

---

## WebSocket Streams

Connect to real-time event feeds using Django Channels:

### 1. Live SIEM Events
- **URL:** `ws://localhost:8000/ws/events/`
- **Payload:** Real-time stream of newly ingested security events and anomalous triggers.

### 2. Live Scan Progress
- **URL:** `ws://localhost:8000/ws/scans/<scan_id>/`
- **Payload:** Real-time percentage completion, current URL spidering, discovered alerts.

### 3. Security Dashboard Real-Time Metrics
- **URL:** `ws://localhost:8000/ws/dashboard/`
- **Payload:** Live updates to risk score, active incident count, and threat notifications.
