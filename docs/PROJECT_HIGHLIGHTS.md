# Project Highlights: HEM-CM

## One-line pitch

HEM-CM is an open-source event intelligence terminal that turns breaking news into an end-to-end, explainable research workflow: classification, stage detection, causal chains, multi-horizon scenario forecasts, market impact mapping, and backtest replay.

## Why it stands out on GitHub

- It is not just UI. The repository contains a full event engine and data pipeline.
- It is not a black-box LLM wrapper. The core is explainable, reproducible, and upgradeable.
- It feels like a product: dashboards, war-room detail views, replay labs, model center, settings.
- It runs locally and ships with demo data, so reviewers can see the full experience quickly.

## Model-layer highlights

### 1. A general causal parent model

Events are represented with reusable reasoning primitives:

- actors
- objectives
- incentives
- constraints
- triggers
- responses
- diffusion paths
- market transmission layers

This makes the system closer to an event operating system than a news feed.

### 2. Six specialized event sub-models

The repository includes six configurable families:

- geopolitics / war
- trade / policy
- regulation / law
- corporate / industry
- society / labor
- technology / platform

Each family ships with:

- variables
- weights
- stage biases
- scenario path templates
- market mapping matrices
- UI focus areas

### 3. Explainable scenario forecasting

Forecasting is deliberately structured and auditable:

- fixed horizons: 7 / 30 / 90 / 180 / 365 days
- three scenario paths per horizon
- probability normalization
- stage-aware scoring
- explicit conditions and invalidation signals

This is a strong fit for research, education, and AI augmentation.

### 4. Cross-market mapping

The market engine maps one event into downstream lenses:

- China society
- A-shares
- US equities
- commodities
- rates / FX / risk appetite

It further decomposes impacts into:

- winners vs losers
- priced-in level
- crowding

## AI-ready design

Even without external LLM dependencies, the project is designed in a way that is ready for AI augmentation:

- model logic is modular and configuration-driven
- data is stored in structured form, suitable for retrieval and reasoning
- signals, events, scenarios, and impacts are separated cleanly, enabling agentic enhancements

Natural AI extension directions:

- retrieval-assisted evidence ranking
- LLM-assisted signal summarization
- scenario critique and explanation generation
- multilingual content generation
- stronger document extraction from live sources

## Product-layer highlights

- Global Overview dashboard, not a plain list
- Event War Room detail page with causal chain, scenario panel, and impact grid
- Market Desk with existing-event search and live analysis intake
- Backtest Lab for replay and evaluation
- Model Center for configuration and versioning
- Bilingual UI for global readability

## Suggested GitHub positioning keywords

- event intelligence
- causal scenario engine
- explainable forecasting
- cross-market impact mapping
- open-source research terminal
- AI-ready event operating system
