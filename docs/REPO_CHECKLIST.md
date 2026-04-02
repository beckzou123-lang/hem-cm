# HEM-CM Repository Checklist

This checklist is the final open-source release audit for HEM-CM. It is designed as a maintainer-facing reference to verify that the repository remains usable, reviewable, and contributor-ready.

## Product readiness

- [x] The app runs locally with demo data
- [x] `npm run build` passes
- [x] `npm run validate` passes
- [x] Core product surfaces are available: dashboard, event detail, markets, signals, backtests, models, settings
- [x] English-first bilingual product surface is available

## Repository presentation

- [x] README hero explains the product clearly
- [x] README includes screenshots and quick-start instructions
- [x] Chinese README is available
- [x] GitHub About copy is prepared
- [x] Social preview asset is prepared
- [x] Release notes are prepared
- [x] Roadmap is published
- [x] Community-post copy is prepared

## Community and contribution flow

- [x] Discussions are enabled
- [x] Welcome discussion is published
- [x] Feature-priority discussion is published
- [x] CONTRIBUTING guide exists
- [x] Issue templates exist
- [x] Pull request template exists
- [x] Code of Conduct exists
- [x] CODEOWNERS exists

## Trust and governance

- [x] SECURITY.md exists
- [x] FUNDING.yml exists
- [x] Dependabot configuration exists
- [x] Architecture guide exists
- [x] Adapter guide exists
- [x] Model guide exists
- [x] Chinese mirrors exist for architecture and key contributor guides

## GitHub visibility checks

- [x] SECURITY.md is visible on GitHub
- [x] CODEOWNERS is visible on GitHub
- [x] FUNDING.yml is visible on GitHub
- [x] Chinese architecture document is visible on GitHub
- [x] Private vulnerability reporting has been manually confirmed in repository settings
- [x] Dependency graph has been manually confirmed in repository settings
- [x] Dependabot alerts have been manually confirmed in repository settings
- [x] Dependabot security updates have been manually confirmed in repository settings
- [ ] GitHub Sponsors button has been manually confirmed on the repository page

## Manual follow-up items

These items may require maintainer-side GitHub settings or platform eligibility checks:

- confirm private vulnerability reporting is enabled in GitHub repository settings
- confirm GitHub Sponsors is enabled for the maintainer account if the repository should display sponsor entry points
- periodically refresh screenshots and launch copy after major product updates
- keep release notes, roadmap, and community prompts aligned with the current product scope

## Recommended release discipline

Before each major release:

1. run build and validation again
2. confirm README screenshots still match the product
3. review release notes and roadmap for stale claims
4. review security and contribution docs for outdated instructions
5. verify Discussions and issue templates still reflect current contributor flows

## Summary

If all checked items remain true, the repository is in a strong state for:

- first impressions
- technical review
- contributor onboarding
- community discussion
- future open-source iteration
