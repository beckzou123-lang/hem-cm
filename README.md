# HEM-CM

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![CI](https://github.com/beckzou123-lang/hem-cm/actions/workflows/ci.yml/badge.svg)](https://github.com/beckzou123-lang/hem-cm/actions/workflows/ci.yml)
[![Issues](https://img.shields.io/github/issues/beckzou123-lang/hem-cm)](https://github.com/beckzou123-lang/hem-cm/issues)

HEM-CM, short for Human Event Matrix for Capital Markets, is an open-source event intelligence terminal that turns breaking news into causal chains, scenario forecasts, market impact maps, and replayable research workflows.

[中文说明](./README.zh-CN.md)

## Why HEM-CM

Most market dashboards stop at aggregation. HEM-CM goes further:

- It classifies events into explainable geopolitical, regulatory, trade, corporate, social, and technology families.
- It identifies the current event stage instead of treating all signals as equal.
- It generates multi-horizon path forecasts with conditions and invalidation signals.
- It maps the same event into A-shares, US equities, commodities, and macro risk buckets.
- It ships as a full local product, not just a static mockup.

## Core Highlights

- **General causal parent model + six event sub-models**  
  The system uses one reusable causal backbone and six configurable event families, making the logic transparent and extensible.

- **Explainable path forecasting**  
  Each event produces 7 / 30 / 90 / 180 / 365-day horizons, with three scenario paths per horizon.

- **Cross-market impact engine**  
  One event can be translated into sector winners, losers, priced-in levels, crowding, and macro risk appetite shifts.

- **Live source intake workflow**  
  Users can ingest Google News search results, site-specific results, RSS feeds, JSON endpoints, or webpages directly into the event pipeline.

- **Backtest and replay lab**  
  The product does not stop at prediction. It includes replay windows, realized outcomes, fit scores, and error analysis.

- **Bilingual product experience**  
  The interface supports English and Chinese, with English as the default language.

## Product Surface

- `/` Global Overview: hot events, family risk heatmap, cross-market overview, signal stream
- `/events/[id]` Event War Room: causal chain, actors, scenario paths, impact grid, export, alert, watchlist
- `/markets` Market Desk: sector ranking, priced-in status, expectation gap, event search and live analysis
- `/backtests` Backtest Lab: replay windows, forecast vs actual outcome, fit score, error analysis
- `/signals` Signal Monitor: multi-source confirmation, signal grading, model-entry status, live source ingestion
- `/models` Model Center: parent model, sub-models, thresholds, variables, versions, source rules
- `/settings` Settings: language, theme, refresh cadence, demo mode, export format, market preference

## Model Design

### 1. Parent causal model

The parent model is designed around reusable event reasoning primitives:

- actors
- objectives
- incentives
- constraints
- triggers
- responses
- diffusion paths
- market transmission layers

This makes HEM-CM feel like an event operating system rather than a simple news board.

### 2. Six specialized event sub-models

The current repository includes dedicated configurations for:

- geopolitics / war
- trade / policy
- regulation / law
- corporate / industry
- society / labor
- technology / platform

Each sub-model contains:

- its own variables
- weights
- stage biases
- path templates
- market mapping matrices
- UI focus areas

### 3. Scenario forecasting

Forecasting is deliberately explainable:

- fixed horizon set
- three path candidates per horizon
- probability normalization
- stage-aware scoring
- explicit conditions and invalidation signals

### 4. Market mapping

The market engine converts event understanding into structured downstream views:

- China society
- A-shares
- US equities
- commodities
- rates / FX / risk appetite

## AI and Tooling Perspective

HEM-CM is intentionally not a black-box LLM demo.

- The current engine is rule-based, configuration-driven, and locally reproducible.
- The architecture is easy to audit, validate, and extend.
- It is a strong foundation for future AI augmentation, such as:
  - retrieval-assisted evidence ranking
  - LLM-assisted signal summarization
  - model critique and scenario explanation
  - multilingual content generation

This design makes the repository useful both as a working product and as an AI-ready research platform.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Prisma
- SQLite
- Tailwind CSS
- Recharts
- Zod
- Zustand

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Prepare environment variables

```bash
cp .env.example .env
```

### 3. Initialize SQLite

```bash
npm run db:init
```

If you want to regenerate the initialization SQL yourself:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/init.sql
npm run db:init
```

### 4. Seed demo data

```bash
npm run seed
```

### 5. Start the app

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## One-Command Demo

```bash
./scripts/dev.sh
```

## Validation

Run the built-in validation script:

```bash
npm run validate
```

It checks:

- flagship real-world cases exist
- each flagship case has 5 horizons × 3 paths
- market mappings are generated
- causal chains are generated
- probabilities are close to normalized

## Repository Structure

```text
HEM.CM_System/
├── app/
├── components/
├── modules/
├── lib/
├── prisma/
├── data/
├── scripts/
├── public/
├── tests/
├── .env.example
├── package.json
└── README.md
```

## Open Source Roadmap

- richer multilingual content generation
- more event families and source adapters
- stronger replay evaluation metrics
- collaboration and annotation workflows
- optional AI copilot modules for evidence explanation

## Notes

- Demo data ships with the repository so the product is visible immediately after setup.
- Live-source extraction depends on target site accessibility and structure stability.
- Model thresholds and source rules can be tuned from the Model Center.
- The default interface language is English, and Chinese can be switched on from Settings.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

MIT. See [LICENSE](./LICENSE).
