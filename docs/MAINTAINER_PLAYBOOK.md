# HEM-CM Maintainer Playbook

This playbook is a practical operating guide for maintaining HEM-CM as a long-lived open-source repository.

## Core maintainer goals

The maintainer workflow should keep four things healthy at the same time:

- product credibility
- repository clarity
- contributor throughput
- security and dependency hygiene

When trade-offs appear, prefer changes that keep the repository understandable and reviewable.

## Daily or weekly review loop

At least once per week, review:

- open pull requests
- open issues
- Discussions activity
- CI failures
- dependency update pull requests
- release notes and roadmap drift after recent product changes

If the repository is quiet, a short weekly pass is usually enough.

## Standard dependency-update flow

When a dependency update pull request arrives:

1. Review the package scope and whether it is framework-critical
2. Pull the branch locally
3. Run the standard verification path
4. Merge only after the checks and a quick product sanity pass look reasonable

Use this local verification order:

```bash
npm ci
cp .env.example .env
npm run db:init
npm run seed
npm run build
npm run validate
```

For framework-sensitive upgrades such as Next.js, React, Prisma, or TypeScript, also do a quick manual smoke test of:

- home page
- event detail page
- signals page
- settings page

## Build and release discipline

Before any meaningful release:

1. run build and validate again
2. confirm screenshots still match the current UI
3. review README, roadmap, release notes, and community copy for stale claims
4. confirm discussions, templates, and contribution docs still reflect current maintainer expectations
5. confirm the latest governance files are still visible on GitHub

Use `docs/REPO_CHECKLIST.md` as the release gate reference.

## Discussion and issue triage

Use these boundaries:

- Discussions for open-ended ideas, workflow feedback, and community conversation
- Issues for reproducible bugs, scoped feature requests, and concrete work items
- Pull requests for reviewed implementation changes

When triaging:

- convert unclear issues into Discussions if they are still exploratory
- ask for reproduction detail when a bug report is not actionable
- link feature requests to roadmap themes when possible
- close stale requests only after leaving a clear explanation

## Security event handling

For security-related reports:

- do not ask reporters to disclose details publicly
- use private vulnerability reporting when available
- move the conversation out of public issues if needed
- confirm impact and affected surfaces before promising a release timeline
- document the fix in release notes or a security advisory when appropriate

Use `SECURITY.md` as the source of truth for reporting expectations.

## Documentation upkeep

If product behavior changes, review the related docs in the same maintenance pass.

Common files to refresh together:

- `README.md`
- `README.zh-CN.md`
- `docs/ROADMAP.md` or `ROADMAP.md`
- `docs/RELEASE_*.md`
- `docs/COMMUNITY_POSTS.md`
- `docs/ARCHITECTURE.md`
- `docs/ADAPTER_GUIDE.md`
- `docs/MODEL_GUIDE.md`
- Chinese mirrors when wording changes affect onboarding

If the repository gains a new core workflow, explain it in both the product-facing docs and the maintainer-facing docs.

## GitHub settings audit

Periodically confirm:

- private vulnerability reporting is enabled
- Discussions remain enabled
- funding links are still correct
- CODEOWNERS still reflects the real reviewer boundary
- issue and pull request templates still match the contribution flow
- CI still runs on `push`, `pull_request`, and manual dispatch

## Dependabot handling rules

The repository now uses Dependabot for npm and GitHub Actions updates.

Recommended handling:

- patch and minor updates can be merged after CI and a quick sanity review
- framework-critical upgrades should be reviewed more carefully
- do not batch unrelated breaking changes into one merge
- if a dependency PR breaks `build` or `validate`, leave a note and defer until the repository is ready

## When to cut a release

A release is a good fit when:

- the core workflow is stable
- docs match the current product
- community entry points are active
- security and governance files are up to date
- recent dependency updates are not leaving the repository red

If any of these are not true, prefer another cleanup pass before tagging.

## Maintainer checklist

For a fast pass, confirm:

- CI is green
- open dependency PRs are triaged
- no critical bug reports are blocked without response
- README and screenshots still feel current
- roadmap and release notes are not misleading
- security reporting remains enabled
- sponsor links still point to the intended maintainer account

## Summary

The healthiest maintenance pattern for HEM-CM is simple:

- keep the product runnable
- keep the repository explainable
- keep contributor flows lightweight
- keep security and dependency handling visible and routine

That discipline matters more than adding a large amount of process.
