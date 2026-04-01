# Contributing to HEM-CM

Thanks for considering a contribution.

## Ways to contribute

- report bugs
- improve documentation
- refine model logic
- add new source adapters
- improve UI and interaction quality
- add validation coverage

## Local setup

```bash
npm install
cp .env.example .env
npm run db:init
npm run seed
npm run dev
```

## Before opening a pull request

- keep changes focused
- verify the app still builds with `npm run build`
- run `npm run validate` when touching the event pipeline or model logic
- update README or docs if product behavior changes

## Project principles

- prefer explainable logic over hidden magic
- keep model behavior auditable and reproducible
- keep UI product-like, not only technically correct
- avoid committing secrets, local databases, or generated dependency folders

## Good first contribution areas

- new event family templates
- source classification improvements
- better multilingual content handling
- more replay and evaluation metrics
- issue templates, docs, and onboarding improvements

## Pull request checklist

- describe what changed
- explain why the change matters
- mention verification steps
- include screenshots for UI changes when possible

Thanks for helping make HEM-CM better.
