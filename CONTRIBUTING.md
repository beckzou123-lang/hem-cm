# Contributing to HEM-CM

Thanks for helping improve HEM-CM.

## What contributions are most useful

- bug reports with clear reproduction steps
- documentation and onboarding improvements
- new source adapters and ingestion presets
- model transparency improvements
- replay, evaluation, and benchmark design
- UI polish that makes workflows easier to inspect

## Before you start

- search existing issues and discussions before opening a new one
- use Discussions for open-ended ideas and workflow feedback
- use Issues for actionable bugs, scoped feature requests, and concrete tasks
- keep changes focused so review and validation stay simple

## Local setup

```bash
npm install
cp .env.example .env
npm run db:init
npm run seed
npm run dev
```

Open the app locally after setup and confirm the seeded demo is visible.

## Development workflow

1. Create a branch from `main`
2. Make a focused change
3. Verify the affected surface locally
4. Update docs when behavior, terminology, or setup changes
5. Open a pull request with context and verification notes

## Validation expectations

- run `npm run build` for any code change
- run `npm run validate` when changing event logic, model logic, replay logic, or ingestion behavior
- include screenshots for UI changes when possible
- mention test data, event ids, or pages used for verification when relevant

## Project principles

- prefer explainable logic over opaque automation
- keep model behavior auditable and reproducible
- optimize for real research workflows, not only visual polish
- avoid committing secrets, local databases, or dependency folders
- preserve the English-first bilingual experience when editing product copy

## Model and data changes

When contributing to event logic or scenario paths, include:

- the event family or model surface affected
- the reasoning behind the change
- what signals, thresholds, or mappings were adjusted
- how you verified the result did not regress other workflows

## Good first contribution areas

- new event family templates
- source classification improvements
- more replay and evaluation metrics
- documentation, issue templates, and onboarding refinements
- bilingual UX copy and terminology cleanup

## Pull request checklist

- describe what changed
- explain why it matters
- note verification steps
- link related issues or discussions
- include screenshots for UI work when applicable

## Community standards

Please follow the repository [Code of Conduct](./CODE_OF_CONDUCT.md) in issues, discussions, and pull requests.
