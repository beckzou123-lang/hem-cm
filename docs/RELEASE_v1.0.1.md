# HEM-CM v1.0.1 – Security Patch Release

## TL;DR

HEM-CM v1.0.1 is a patch release focused on dependency security, release consistency, and repository maintenance quality.

It closes the previously reported high-severity Dependabot alert by upgrading the Prisma dependency chain to patched versions and re-verifying the project locally.

Start here:

- GitHub Release: [v1.0.1](https://github.com/beckzou123-lang/hem-cm/releases/tag/v1.0.1)
- Product overview: [README.md](../README.md)
- Chinese introduction: [README.zh-CN.md](../README.zh-CN.md)

## Highlights

- Upgraded `prisma` to `^6.19.3`
- Upgraded `@prisma/client` to `^6.19.3`
- Resolved the transitive vulnerability path through `@prisma/config` and `effect`
- Confirmed the GitHub Dependabot alert has been closed after the patch reached the default branch
- Synced repository version metadata and README release entry points to v1.0.1

## Scope of This Release

- Dependency security patch
- Repository release metadata alignment
- No product workflow changes
- No feature-surface expansion

## Validation Status

- Production build verified
- Validation script verified
- `npm audit` verified with 0 vulnerabilities
- GitHub Dependabot alert status verified as closed
- Git tag and GitHub Release verified as published

## Breaking Changes

None.

## Known Issues

- Live-source extraction quality still depends on target site structure and accessibility
- Demo seed content is intentionally curated and does not auto-translate all database content
- Social preview updates on GitHub may take a short time to propagate across all caches

## Who Should Upgrade

- Maintainers who want repository metadata to match the latest published release
- Users tracking the GitHub release feed for stable patch updates
- Developers who want the patched Prisma dependency chain

## Roadmap

- More event families and source adapters
- Richer multilingual content generation
- Stronger replay evaluation metrics
- Optional AI copilot modules for evidence explanation
- Collaboration and annotation workflows

## Feedback Request

If you are using HEM-CM after v1.0.1, the most useful feedback right now is:

- Whether the setup path feels clear for first-time contributors
- Whether the current release notes and README entry points are easy to follow
- Which model, adapter, or workflow area should receive the next maintenance pass

Open an Issue or Discussion with your feedback.
