# HEM-CM Architecture

HEM-CM is a local-first event intelligence terminal built on Next.js App Router, Prisma, and SQLite. The repository combines product surfaces, an explainable event engine, replay and validation flows, and repository-level launch assets in a single TypeScript codebase.

## System overview

At a high level, the system turns incoming source signals into structured event bundles, stores them in SQLite through Prisma, and renders those results across dashboard, event-detail, market, signal, backtest, and model-management surfaces.

The architecture is intentionally opinionated:

- product-first, not notebook-first
- explainable, not black-box
- modular, not monolithic business logic in pages
- local-first, so the full workflow is inspectable on a single machine

## Runtime layers

### 1. Web application shell

The App Router entry point lives in `app/`. The root layout initializes global UI concerns:

- theme provider
- locale resolution and dictionary injection
- navigation shell
- server-side scheduler bootstrapping

This keeps shared application state and global layout concerns out of individual pages.

### 2. Server-side data composition

`lib/data.ts` is the main aggregation layer for page-facing data. It:

- ensures demo data exists
- reads runtime preferences
- fetches events, signals, and market impacts through Prisma
- applies demo-mode runtime adjustments
- reshapes persisted records into UI-facing view models

Pages stay relatively thin because this layer centralizes read-side composition.

### 3. Event and model engine

The domain engine lives in `modules/`. The main event-bundle pipeline composes several specialized engines:

- classification engine
- stage engine
- signal engine
- causal engine
- prediction engine
- market engine
- backtest engine

`modules/event-engine/index.ts` is the orchestration point that converts one raw event sample into a structured bundle.

### 4. Persistence layer

Prisma models define the durable shape of the system:

- events and event clusters
- signals
- path predictions
- market and sector impacts
- backtest runs
- model and source configs
- user preferences and alert rules

SQLite is the default local database, which keeps setup simple and makes the full stack easy to inspect.

## Key directories

### `app/`

UI routes and API endpoints for the Next.js application.

- page surfaces for dashboard, event details, signals, markets, backtests, settings, and model workflows
- route handlers under `app/api/` for data access and product actions

### `components/`

Reusable UI pieces organized by product surface and shared layout.

### `lib/`

Application services and runtime boundaries.

Important responsibilities include:

- Prisma access
- locale and dictionary handling
- dashboard and detail data composition
- scheduler startup
- utility formatting and shared types

### `modules/`

Explainable domain engines. Each module owns one part of event reasoning instead of mixing all logic into UI or route handlers.

### `prisma/`

Database schema, initialization SQL, and seed logic.

### `docs/`

Repository-facing documentation for launch, roadmap, community, architecture, and GitHub presentation.

## Primary data flow

### 1. Source intake

Raw source items enter through seeded demo data or live-source refresh flows. Source adapters normalize heterogeneous inputs into repository-friendly samples.

### 2. Event bundle construction

The event engine transforms raw samples into structured outputs:

- family classification
- stage derivation
- aggregated signal metrics
- mother-model state
- causal chain
- multi-horizon path predictions
- market and sector impacts
- replay or backtest payloads

### 3. Persistence

The structured outputs are stored through Prisma models so they can be reused across surfaces without recomputing every view from scratch.

### 4. Read-side shaping

`lib/data.ts` turns persisted objects into dashboard cards, heatmaps, market tables, event-detail sections, and signal feeds.

### 5. Product rendering

Next.js pages render those shaped objects inside the app shell with locale-aware labels and formatting.

## Core domain model

The repository is centered on one reusable parent causal model plus six configurable event families.

### Parent model

The parent model captures stable reasoning primitives such as:

- actors
- drivers
- constraints
- triggers
- responses
- transmission paths

### Event-family specialization

Each family adds its own classification logic, stage bias, path templates, and market-mapping behavior. This keeps the system extensible while preserving a common reasoning grammar.

### Multi-horizon forecasting

Predictions are generated across fixed horizons:

- 7 days
- 30 days
- 90 days
- 180 days
- 365 days

Each horizon can contain multiple paths with conditions and invalidation signals, which is why the system is more inspectable than a simple score-based dashboard.

## Persistence model

The Prisma schema separates write models by responsibility:

- `EventCluster` groups related event objects
- `Event` stores the current canonical event state
- `Signal` stores source-level evidence
- `PathPrediction` stores structured scenario paths
- `MarketImpact` and `SectorImpact` store downstream market views
- `BacktestRun` stores replay and validation results
- `ModelConfig` and `SourceConfig` store configurable system behavior
- `UserPreference` stores product-level runtime preferences including locale

This shape supports both product rendering and future model iteration.

## Runtime and safety boundaries

Several repository boundaries are enforced deliberately:

- Prisma is protected from accidental browser import
- scheduler code is server-only
- locale resolution is server-driven and then passed into client-safe providers
- app-shell rendering is prop-driven so server-only helpers do not leak into the client graph

These boundaries matter because the repository mixes Server Components, Client Components, and local runtime services in one codebase.

## Scheduler and refresh behavior

The scheduler is bootstrapped from the root layout and currently updates runtime metadata on a cron interval. This keeps recurring refresh concerns centralized instead of tying them to page requests.

For local-first development, this approach is intentionally lightweight:

- no external queue
- no separate worker service
- no infrastructure-heavy orchestration requirement

## Validation philosophy

HEM-CM treats validation as part of the product architecture, not a separate afterthought.

Key validation surfaces include:

- seeded demo flows for first-run visibility
- build verification through `npm run build`
- replay and validation scripts through `npm run validate`
- backtest surfaces in the product itself

This makes the repository easier to review, demo, and extend.

## Extension points

The most important extension points for contributors are:

- new source adapters
- new event-family templates
- improved stage and path logic
- richer replay metrics
- stronger explainability panels
- improved export and AI-ready structured outputs

## Architecture summary

HEM-CM is best understood as a layered local research system:

- Next.js provides product surfaces and routing
- `lib/` shapes runtime data for UI consumption
- `modules/` performs explainable event reasoning
- Prisma and SQLite persist structured outputs
- repository docs and governance files support open-source adoption

That separation is what lets the project feel like a real product while staying transparent enough for research, debugging, and future AI augmentation.
