# CyberSentinel 🛡️

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2-green?logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Celery](https://img.shields.io/badge/Celery-5-37814A?logo=celery&logoColor=white)](https://docs.celeryq.dev)
[![OWASP](https://img.shields.io/badge/OWASP-ZAP%20Integrated-orange?logo=owasp&logoColor=white)](https://www.zaproxy.org)

**An Advanced Cybersecurity Operations (SOC) & Application Security (AppSec) Platform**

> *Protect. Detect. Respond.*

CyberSentinel is an enterprise-grade, full-stack cybersecurity operations and application security management platform. It unifies web and API security scanning, vulnerability lifecycle management, SIEM-style real-time event monitoring, rule-based threat detection, threat intelligence enrichment, asset risk scoring, SOC incident response workflows, DevSecOps pipeline integration, and AI-powered security analyst recommendations into a single holographic command center.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
  - [Option B: Local Development Setup](#option-b-local-development-setup)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [DevSecOps & CI/CD](#devsecops--cicd)
- [Security Policy](#security-policy)
- [License](#license)

---

## 🌟 Overview

Modern organizations face decentralized security challenges: siloed vulnerability tools, disconnected SIEM alerts, scattered threat intel feeds, and slow incident triage. 

**CyberSentinel** bridges these gaps by providing:
1. **AppSec Automated Testing**: Automated crawling, dynamic scans via OWASP ZAP, TLS/SSL inspection, security header validation, and OpenAPI specification audits.
2. **SOC Event Ingestion & SIEM**: Ingest logs and telemetry across microservices and servers, stream them in real-time over WebSockets, and trigger detection rules.
3. **Threat Intelligence Correlation**: Automatic IOC (IP, domain, hash) enrichment against VirusTotal, AlienVault OTX, and AbuseIPDB.
4. **Dynamic Risk Scoring**: Continuous asset risk calculation based on open CVE severity, network exposure, active threats, and past security incidents.
5. **SOC Incident Response**: End-to-end incident management with forensic timelines, evidence attachments, and analyst task assignment.
6. **AI Security Analyst**: Interactive AI assistance explaining complex vulnerabilities, analyzing payload logs, and suggesting step-by-step remediation code.

---

## 🚀 Key Features

| Module | Description |
|---|---|
| 🎛️ **3D Security Command Center** | Futuristic Three.js / React Three Fiber holographic security core, real-time threat gauges, incident radar, and interactive vulnerability metrics. |
| 🌐 **Web Security Scanner** | Automated scanner inspecting HTTPS configurations, HSTS, CSP, X-Frame-Options, CORS misconfigurations, cookie security flags, and OWASP ZAP automation. |
| 🔌 **API Security Scanner** | Upload or point to OpenAPI / Swagger schemas to audit authentication schemes, rate limiting, parameter validation, and OWASP API Top 10 weaknesses. |
| 🐞 **Vulnerability Management** | Full vulnerability lifecycle tracking (Discovered → In Progress → Verified → Resolved / False Positive) mapped to CVE, CWE, and CVSS v3 vectors. |
| 📡 **SIEM & Live Event Feed** | High-throughput event ingestion endpoint supporting syslog and JSON schemas, backed by Django Channels WebSockets for sub-second alert streaming. |
| ⚙️ **Threat Detection Engine** | Stateful rule engine capable of flagging brute force attempts, credential stuffing, anomalous IP bursts, and unauthorized admin access. |
| 🕵️ **Threat Intelligence** | Instant IOC lookups (IP addresses, domain names, file hashes) queryable against VirusTotal, AlienVault OTX, and AbuseIPDB with local caching. |
| 📊 **Dynamic Risk Engine** | Asset-based risk posture scoring evaluating asset criticality, exposure, linked vulnerabilities, and active incident trends. |
| 🚨 **Incident Response Workflow** | SOC-grade incident ticket system with severity levels (Critical, High, Medium, Low), investigation timeline, evidence log, and analyst assignments. |
| 🤖 **AI Security Analyst** | OpenAI-assisted triage that translates cryptic security findings into plain-English root causes and provides copy-paste remediation fixes. |
| 🔄 **DevSecOps Integration** | Webhook listener and CI/CD security gate parser supporting SAST (Bandit, Semgrep), dependency auditing (Trivy), and IaC analysis (Checkov). |
| 📄 **Security Reports** | Generates exportable Executive, Compliance, and Technical vulnerability reports in PDF, CSV, and JSON formats. |
| 🏢 **Multi-Tenancy & RBAC** | Organization isolation with granular Role-Based Access Control: `SUPER_ADMIN`, `SECURITY_ADMIN`, `SECURITY_ANALYST`, `DEVELOPER`, and `VIEWER`. |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             CyberSentinel Holographic UI (React)            │
│       Vite • TypeScript • Tailwind CSS • Three.js • Drei   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                      REST API + WebSockets
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Nginx Reverse Proxy                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                Django REST Framework & Channels             │
│        JWT Auth • RBAC • Audit Log • Detection Engine       │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       ┌───────▼────────┐             ┌────────▼────────┐
       │   PostgreSQL   │             │  Redis 7 Broker │
       │ Primary Store  │             │   Cache & WS    │
       └────────────────┘             └────────┬────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  Celery Workers │
                                      │ & Celery Beat   │
                                      └────────┬────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               │                               │                               │
        ┌──────▼──────┐                 ┌──────▼──────┐                 ┌──────▼──────┐
        │  OWASP ZAP  │                 │ Threat Intel│                 │ AI Analyst  │
        │ Scan Daemon │                 │ (VT/OTX/IP) │                 │  (OpenAI)   │
        └─────────────┘                 └─────────────┘                 └─────────────┘
```

For more details on data flows and state machines, see [docs/architecture.md](docs/architecture.md).

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide Icons
- **3D & Visualizations:** Three.js, `@react-three/fiber`, `@react-three/drei`, Recharts
- **State & Networking:** Zustand, Axios, Native WebSocket Client
- **Animations & Feedback:** Framer Motion, React Hot Toast

### Backend
- **Framework:** Python 3.11+, Django 4.2 LTS, Django REST Framework
- **Asynchronous & Real-time:** Django Channels, ASGI, Daphne/Uvicorn, Celery, Redis
- **Authentication & Security:** SimpleJWT, Argon2 password hashing, Django-CORS-Headers
- **Database & ORM:** PostgreSQL 15, `psycopg2-binary`, `dj-database-url`
- **Documentation & OpenAPI:** `drf-spectacular` (Swagger UI & ReDoc)

### Security Engines & External Tools
- **DAST:** OWASP ZAP (Zed Attack Proxy daemon)
- **SAST & Compliance:** Bandit, Semgrep, Trivy, Checkov
- **Threat Intelligence:** VirusTotal API, AlienVault OTX, AbuseIPDB
- **AI Intelligence:** OpenAI GPT API

### Infrastructure & Operations
- **Containerization:** Docker, Docker Compose
- **Web Server:** Nginx (reverse proxy, TLS termination, static asset delivery)
- **CI/CD:** GitHub Actions security scanning workflows

---

## 📁 Repository Structure

```
CyberSentinal/
├── .github/
│   └── workflows/
│       └── security-pipeline.yml   # Automated CI/CD security audit workflow
├── backend/
│   ├── accounts/                   # User authentication, RBAC, profiles, JWT
│   ├── ai_analyst/                 # OpenAI-powered security recommendations
│   ├── assets/                     # Monitored asset registry (domains, IPs, APIs)
│   ├── audit/                      # Immutable audit log system
│   ├── config/                     # Django core settings, ASGI, WS routing, URLs
│   ├── detection/                  # Detection rules and alert generation
│   ├── devsecops/                  # CI/CD security pipeline webhook receiver
│   ├── incidents/                  # Incident response lifecycle and evidence
│   ├── notifications/              # Alert notification system
│   ├── organizations/              # Multi-tenant organization tenant management
│   ├── reports/                    # Executive and technical report generator
│   ├── risk/                       # Asset risk formula & posture calculation
│   ├── scans/                      # Web & API scanners, OWASP ZAP integration
│   ├── security_events/            # SIEM event ingestion & WebSocket streaming
│   ├── threat_intelligence/        # VirusTotal, AlienVault, AbuseIPDB integration
│   ├── vulnerabilities/            # Vulnerability tracker (CVE, CWE, CVSS)
│   ├── Dockerfile                  # Production backend container build
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── public/                     # Static assets and icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── 3d/                 # CyberBackground & SecurityCore 3D scenes
│   │   │   ├── charts/             # Recharts SecurityGauge, EventsChart, VulnChart
│   │   │   ├── layout/             # TopBar, Sidebar, AppLayout
│   │   │   └── ui/                 # LiveEventFeed, LoadingScreen, modals
│   │   ├── pages/                  # Dashboard, Scanner, SIEM, ThreatIntel, AIAnalyst, etc.
│   │   ├── services/               # REST API & WebSocket service connectors
│   │   ├── store/                  # Zustand global state stores (auth, theme)
│   │   ├── App.tsx                 # Client routing & layout wrapper
│   │   └── main.tsx                # Application root entrypoint
│   ├── Dockerfile                  # Frontend container build
│   ├── package.json                # Frontend dependencies and scripts
│   └── vite.config.ts              # Vite configuration
├── docs/
│   ├── architecture.md             # System architecture and data flows
│   ├── api.md                      # Comprehensive REST and WebSocket API reference
│   └── roadmap.md                  # Development phases and milestones
├── infrastructure/
│   ├── docker/                     # Docker configurations
│   ├── kubernetes/                 # Kubernetes deployment manifests
│   ├── nginx/
│   │   └── nginx.conf              # Production Nginx reverse proxy configuration
│   └── terraform/                  # Cloud infrastructure IaC
├── docker-compose.yml              # Multi-container orchestration (1-command start)
├── .env.example                    # Sample environment variable template
├── .gitignore                      # Git ignore rules for node, python, secrets
├── LICENSE                         # MIT License
└── SECURITY.md                     # Vulnerability disclosure & security policy
```

---

## ⚡ Getting Started

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v18+) & [npm](https://npmjs.com/)
- [Python](https://python.org/) (v3.11+)

---

### Option A: Docker Compose (Recommended)

To spin up all services (PostgreSQL, Redis, Django API, Celery Workers, Celery Beat, OWASP ZAP, React Frontend, and Nginx) with a single command:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/suyogshelke/CyberSentinal.git
   cd CyberSentinal
   ```

2. **Configure your environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your secrets and API keys
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application:**
   - 🌐 **Frontend Command Center:** [http://localhost:5173](http://localhost:5173) (or `http://localhost` via Nginx)
   - ⚙️ **Backend REST API:** [http://localhost:8000/api/](http://localhost:8000/api/)
   - 📖 **Interactive Swagger UI:** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
   - 🛡️ **Django Administration:** [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

### Option B: Local Development Setup

#### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure backend environment
cp ../.env.example .env

# Apply migrations
python manage.py migrate

# Create administrator account
python manage.py createsuperuser

# Start development ASGI server
python manage.py runserver 0.0.0.0:8000
```

#### 2. Start Celery Worker (In a separate terminal)
```bash
cd backend
celery -A config worker -l info
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the CyberSentinel operations interface.

---

## 🔑 Environment Configuration

Key configuration variables available in `.env.example`:

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django cryptographic secret key | *Generate a secure key for production* |
| `DEBUG` | Enable Django debug mode | `True` (dev) / `False` (prod) |
| `DB_NAME` | PostgreSQL database name | `cybersentinel` |
| `DB_USER` / `DB_PASSWORD` | PostgreSQL credentials | `cybersentinel` / `cybersentinel_password` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `CELERY_BROKER_URL` | Celery message broker | `redis://localhost:6379/0` |
| `ZAP_HOST` / `ZAP_PORT` | OWASP ZAP connection host & port | `localhost` / `8090` |
| `VIRUSTOTAL_API_KEY` | VirusTotal threat intel API key | *(Optional)* |
| `ALIENVAULT_OTX_API_KEY` | AlienVault OTX threat intel API key | *(Optional)* |
| `ABUSEIPDB_API_KEY` | AbuseIPDB reputation API key | *(Optional)* |
| `OPENAI_API_KEY` | OpenAI API key for AI Security Analyst | *(Optional)* |

---

## 📚 API Documentation

CyberSentinel exposes a rich OpenAPI 3.0 schema:
- **Swagger UI:** `http://localhost:8000/api/docs/`
- **ReDoc:** `http://localhost:8000/api/redoc/`
- **Schema JSON:** `http://localhost:8000/api/schema/`

Refer to [docs/api.md](docs/api.md) for full endpoint specifications, request/response models, and WebSocket event dictionaries.

---

## 🔒 Security Policy

We treat security as our highest priority. If you identify a security issue or vulnerability within this platform, please read our [SECURITY.md](SECURITY.md) policy and disclose responsibly to `security@cybersentinel.io`.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by [Suyog Shelke](https://github.com/suyogshelke).
