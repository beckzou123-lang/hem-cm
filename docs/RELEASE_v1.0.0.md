# HEM-CM v1.0.0 – First Open-Source Release

## TL;DR

HEM-CM is now publicly available as an open-source event intelligence terminal for capital markets.

It turns breaking news into explainable causal chains, scenario paths, market impact maps, and replayable research workflows.

Start here:

- Quick start: `npm install` → `npm run dev`
- One-command demo: `./scripts/dev.sh`
- Product overview: [README.md](../README.md)
- Chinese introduction: [README.zh-CN.md](../README.zh-CN.md)

## Highlights

- Explainable event reasoning with parent causal model plus six event sub-models
- Multi-horizon scenario forecasting across 7 / 30 / 90 / 180 / 365-day windows
- Cross-market mapping for A-shares, US equities, commodities, and macro risk buckets
- Live source intake workflow for Google News, RSS, JSON endpoints, and webpages
- Replay and backtest surface for comparing forecast paths with realized outcomes
- English-first bilingual product experience with Chinese support

## Product Surface

- `/` Global Overview
- `/events/[id]` Event War Room
- `/markets` Market Desk
- `/backtests` Backtest Lab
- `/signals` Signal Monitor
- `/models` Model Center
- `/settings` Settings

## Documentation Included

- Main README with screenshots and quick start
- Chinese README for local-language onboarding
- Contributing guide
- Code of Conduct
- GitHub About / Topics / social-preview kit

## Validation Status

- Demo seed pipeline verified
- Production build verified
- Validation script verified
- Repository README, screenshots, About, Topics, and Social Preview configured

## Breaking Changes

None.

## Known Issues

- Live-source extraction quality still depends on target site structure and accessibility
- Demo seed content is intentionally curated and does not auto-translate all database content
- Social preview updates on GitHub may take a short time to propagate across all caches

## Who This Is For

- Event-driven researchers
- Macro and cross-asset analysts
- PMs and strategy builders
- Developers exploring explainable AI-ready financial tooling

## Roadmap

- More event families and source adapters
- Richer multilingual content generation
- Stronger replay evaluation metrics
- Optional AI copilot modules for evidence explanation
- Collaboration and annotation workflows

## Feedback Request

If you try HEM-CM, the most useful feedback right now is:

- Which page provides the most value first
- Which event family or source adapter you want next
- Which part of the setup or reasoning flow feels unclear

Open an Issue or Discussion with your feedback.
