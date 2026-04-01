# Security Policy

## Supported versions

HEM-CM is currently maintained as a fast-moving open-source project.

| Version | Supported |
| --- | --- |
| `main` | Yes |
| Latest tagged release | Yes |
| Older releases | No |

## Reporting a vulnerability

Please do not open a public issue for security vulnerabilities.

Preferred reporting path:

1. Use GitHub private vulnerability reporting for this repository if it is available
2. If private reporting is not available, contact the maintainer privately through the GitHub account linked to this repository
3. Include reproduction steps, affected pages or workflows, impact, and any proof-of-concept details

Please avoid posting exploit details in Issues, Discussions, or Pull Requests before a fix is ready.

## What to include

Helpful reports usually include:

- affected version, branch, or deployment mode
- impact summary
- reproduction steps
- required configuration or data conditions
- logs, screenshots, or proof-of-concept notes when safe to share
- suggested mitigations, if known

## Response targets

The project aims to:

- acknowledge valid reports within 5 business days
- provide an initial triage or severity assessment within 10 business days
- coordinate a fix and disclosure plan based on severity and reproducibility

These targets are best-effort and may vary for volunteer-maintained periods.

## Disclosure policy

- do not disclose the issue publicly until the maintainer confirms a fix or mitigation is available
- coordinated disclosure is preferred
- once fixed, the repository may document the impact, affected versions, and remediation guidance in release notes or a security advisory

## Scope notes

This project is a local-first research application built with Next.js, Prisma, and SQLite. Reports are especially valuable for:

- authentication or authorization issues in future hosted surfaces
- unsafe server/client boundary crossings
- secret exposure
- arbitrary file access
- insecure source ingestion or unsafe parsing paths
- dependency vulnerabilities with meaningful exploitability in this repository
