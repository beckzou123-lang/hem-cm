# HEM-CM Model Guide

This guide explains how the HEM-CM modeling layer is organized, what can be tuned, and how contributors should think about extending model behavior without breaking explainability.

## Model philosophy

HEM-CM is not built as a black-box prediction system.

Its modeling approach is:

- structured
- explainable
- family-aware
- multi-horizon
- market-linked

The repository models an event as a reusable reasoning object, not just a headline with a score.

## Model stack

The modeling layer is split into two levels:

### 1. Parent causal model

The parent model captures reusable reasoning primitives shared across event families, including:

- actors
- actor goals
- incentive intensity
- constraint intensity
- trigger conditions
- response elasticity
- diffusion paths
- market-transmission mediators

This is the common grammar that keeps different event types comparable.

### 2. Family-specific sub-models

On top of the parent model, HEM-CM defines six configurable families:

- `GEO_WAR`
- `TRADE_POLICY`
- `REGULATION_LAW`
- `CORPORATE_INDUSTRY`
- `SOCIAL_LABOR`
- `TECH_PLATFORM`

Each family contributes its own:

- variable set
- weighting logic
- stage bias
- path templates
- market focus
- visual focus
- mapping behavior

This is why the system can stay extensible without becoming a bag of unrelated heuristics.

## Where model logic lives

The main model-related sources are:

- `modules/config-engine/default-config.ts`
- `modules/event-engine/index.ts`
- `modules/classification-engine/`
- `modules/stage-engine/`
- `modules/signal-engine/`
- `modules/causal-engine/`
- `modules/prediction-engine/`
- `modules/market-engine/`
- `modules/backtest-engine/`
- `modules/seed-engine/index.ts`

The persistence layer for model records lives in `prisma/schema.prisma` through `ModelConfig` and related output tables.

## Event-bundle modeling flow

The model pipeline is orchestrated by `buildEventBundle()`.

For each raw event sample, the system:

1. classifies the event family
2. derives the current event stage
3. aggregates signal quality and confirmation strength
4. builds the parent causal model
5. constructs a causal chain
6. computes severity and confidence
7. generates multi-horizon path predictions
8. maps the event into market and sector impacts
9. optionally builds a replay or backtest object

This means the final event record already includes both reasoning state and downstream market interpretation.

## Configurable model surfaces

The most important tunable surfaces are in `default-config.ts`.

### Family variables

Each family declares a domain-specific variable set that communicates what the model cares about.

Examples include:

- military escalation
- tariff intensity
- regulatory scope
- governance quality
- logistics disruption
- platform rule changes

These variables are not cosmetic. They shape how contributors think about family-specific extensions.

### Weights

Each family config includes a `weights` object. These weights determine how much different forces matter in the final scoring logic.

Common dimensions include:

- severity
- confidence
- incentive
- constraint
- signal confirmation
- market transmission
- stage

### Stage bias

Each family has a `stageBias` map keyed by event stage.

This lets the same event become more or less risky depending on whether it is latent, heating, triggered, diffusing, negotiating, realizing, or decaying.

### Path templates

Each family provides path templates with:

- path name
- driver bias
- constraint bias
- narration

These templates are the raw ingredients for scenario generation across all supported horizons.

### Mapping matrices

The market layer uses family-specific mapping matrices to translate the same event into downstream market reactions.

This is how HEM-CM moves beyond event labeling and into:

- sector winners and losers
- priced-in assessment
- cross-market translation
- risk-appetite interpretation

### Thresholds and source rules

Global thresholds and source rules affect model entry and confidence behavior.

Important defaults include:

- model-entry confidence
- priority alert level
- high-risk severity trigger
- priced-in trigger
- minimum confirmations
- signal decay half-life
- conflict noise penalty
- official-source boost

These values shape whether a source bundle becomes a durable event candidate or stays weak and noisy.

## Editable surfaces in the product

The current Model Center exposes a limited but useful editing surface.

Today, contributors can update:

- version
- description
- active flag
- selected thresholds

That surface is intentionally narrower than the full config engine. The codebase still treats deeper model-authoring changes as repository-level edits rather than ad hoc UI changes.

## Persistence model

The modeling layer produces structured outputs that persist separately:

- canonical event state in `Event`
- predictions in `PathPrediction`
- market outputs in `MarketImpact`
- sector decomposition in `SectorImpact`
- replay output in `BacktestRun`
- editable config records in `ModelConfig`

This split matters because each model surface answers a different question:

- what is happening
- why it matters
- what path might happen next
- how markets may react
- how well the model performed historically

## Seeded model data

The repository seeds both event bundles and model config records.

The seed layer creates:

- one global parent model config
- six family-specific sub-model configs
- default source configs
- default thresholds and source rules

This makes the product inspectable immediately after setup and gives contributors a stable baseline for experimentation.

## How to extend model behavior safely

Use this order when making model changes:

1. clarify whether the change belongs to classification, stage logic, signal logic, path logic, or market mapping
2. adjust the narrowest layer possible
3. keep reasoning explicit instead of hiding it in one-off score tweaks
4. update config-first surfaces before hardcoding special cases
5. validate seeded cases and at least one live-intake style case

The goal is not only better outputs. The goal is better outputs that remain debuggable.

## Good contribution targets

High-value model contributions include:

- clearer family variables
- better stage heuristics
- stronger invalidation-signal logic
- richer path narrations
- more realistic market mapping matrices
- better replay metrics
- improved benchmark event sets

## Validation checklist

For model changes, verify:

- predictions still generate across all five horizons
- probability distributions remain sane
- causal-chain structure is still populated
- market impacts still cover the expected output surface
- replay or backtest behavior still works where expected
- `npm run build` passes
- `npm run validate` passes

If the change affects UI-edited model records, verify the Model Center still loads and saves correctly as well.

## Summary

HEM-CM treats modeling as a layered reasoning system:

- parent model for reusable causal grammar
- family models for domain specificity
- predictions for scenario structure
- market mapping for investable translation
- replay for validation

That layered design is the main reason the repository can evolve toward stronger intelligence while staying inspectable enough for open-source collaboration.
