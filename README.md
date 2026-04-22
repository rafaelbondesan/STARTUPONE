# SecOrch - DevSecOps Orchestration Platform

Plataforma SaaS de orquestração de segurança para o ciclo de desenvolvimento de software (DevSecOps).

Dashboard unificado com score de maturidade de segurança por projeto, baseado no OWASP SAMM.

## Stack

- React 18 + Vite
- Recharts (charts)
- Lucide React (icons)

## Local Development

```bash
npm install
npm run dev
```

## Deploy (Vercel)

1. Push to GitHub
2. Import repo on vercel.com
3. Vercel auto-detects Vite — no config needed
4. Deploy

## Features

- **Dashboard** — Executive view with maturity score, vulnerability count, OWASP SAMM radar
- **Projects** — Per-project maturity breakdown, tool coverage, vulnerability details
- **Integrations** — Connected security tools (GitHub, Snyk, SonarQube, etc.)
- **Alerts** — Coverage gaps and priority vulnerabilities
- **Compliance** — PCI DSS, LGPD, SOC2 adherence tracking
- **Settings** — Adaptive gates by criticality level
