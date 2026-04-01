# HEM-CM Adapter Guide

This guide explains how live-source adapters work in HEM-CM, what output shape they must produce, and how to extend the intake pipeline safely.

## Why adapters matter

Adapters are the bridge between external information and the internal event engine.

They are responsible for turning heterogeneous source inputs into normalized documents that the system can:

- classify
- aggregate
- score
- convert into event bundles
- persist for downstream dashboards and analysis

Without adapters, the rest of the repository has no reliable source evidence to reason over.

## Current adapter entry points

The current live intake path is centered around three presets:

- `GOOGLE_NEWS`
- `GOOGLE_NEWS_SITE`
- `PASTE_URL`

These presets are defined in `modules/source-adapters/index.ts` and validated by `lib/schemas.ts`.

## End-to-end intake flow

The live-source flow is:

1. The client submits a source-intake request to `POST /api/intake/analyze`
2. `sourceIntakeSchema` validates the payload
3. `fetchSourceDocuments()` pulls and normalizes external content
4. `buildSampleFromExternalDocuments()` converts normalized docs into a `RawEventSample`
5. `buildEventBundle()` runs the explainable event pipeline
6. `persistEventBundle()` stores the resulting bundle in Prisma models
7. The new event becomes available to dashboard, event-detail, and market surfaces

This separation is intentional:

- adapters fetch and normalize
- intake builds event-ready samples
- engines reason over normalized samples
- persistence stores structured outputs

## Adapter output contract

Every adapter must normalize its output into the `ExternalDocument` shape.

Required fields:

- `title`
- `summary`
- `url`
- `publishedAt`
- `sourceName`
- `sourceType`
- `sourceGrade`
- `signalType`
- `rawPayload`

This contract is important because downstream code assumes the adapter output is already normalized enough to become `RawSignalInput` records and then event-bundle inputs.

## Current normalization behavior

The built-in adapter layer already supports multiple content formats:

- RSS or Atom feeds
- JSON payloads
- direct HTML pages

The parser chooses a strategy based on response content type and the returned payload.

Current helper responsibilities include:

- HTML entity decoding
- tag stripping
- meta extraction
- RSS and Atom parsing
- loose JSON article extraction
- single-page HTML summary extraction
- hostname-based source classification

## Source classification

Adapters do not only fetch documents. They also attach initial source semantics.

The built-in classifier maps hostnames into:

- `sourceType`
- `sourceGrade`
- `signalType`

Examples:

- government hosts are treated as `GOVERNMENT` and often `OFFICIAL`
- exchange or market-oriented hosts can become `EXCHANGE` and `MARKET`
- investor-relations or newsroom hosts can become `CORPORATE`
- everything else falls back to a high-quality `MEDIA` / `NEWS` default

This first-pass classification matters because signal aggregation uses source type, grade, confidence, and confirmation logic to decide whether an event should enter the model.

## Intake sample construction

After adapter normalization, `buildSampleFromExternalDocuments()` enriches the documents into a `RawEventSample`.

That step adds:

- event ids and cluster ids
- title and summary shaping
- tags
- regions
- actors
- base severity and confidence
- driver, constraint, trigger, and market-transmission placeholders

It then calls the classification engine to detect the best-fit family and swaps in a family-specific template so the downstream event engine starts from a more realistic event structure.

## Adding a new adapter preset

The safest extension path is:

1. Add a new preset to `LiveSourcePreset`
2. Extend `sourceIntakeSchema` so requests validate correctly
3. Route the preset inside `fetchSourceDocuments()`
4. Normalize the external response into `ExternalDocument[]`
5. Reuse existing classification and intake helpers wherever possible
6. Validate the output through `buildSampleFromExternalDocuments()` and `buildEventBundle()`

In most cases, you should not modify the event engine just to support a new source. The adapter layer should absorb source-specific messiness first.

## Design rules for new adapters

Prefer these rules when adding adapters:

- keep adapter logic deterministic
- normalize as early as possible
- preserve raw source context in `rawPayload`
- avoid source-specific logic leaking into page components
- classify conservatively when source identity is unclear
- fail with actionable errors when parsing succeeds but analyzable content is missing

## Safety guidelines

Adapters touch untrusted external content, so they should remain careful about:

- malformed HTML or XML
- missing metadata
- unexpected JSON shapes
- duplicated articles
- ambiguous publish times
- unsafe assumptions about source trust

Because HEM-CM is a local-first research tool, explainable failure modes are better than silent best guesses.

## Validation checklist

When you add or change an adapter, verify:

- schema validation still behaves correctly
- the adapter produces valid `ExternalDocument[]`
- the intake layer creates a stable `RawEventSample`
- the event engine still generates predictions and impacts
- persistence succeeds for the new event bundle
- `npm run build` passes
- `npm run validate` still passes when the change affects intake or model behavior

## Practical extension ideas

High-value next adapters include:

- structured government release feeds
- exchange announcement feeds
- company investor-relations pages
- higher-quality JSON news APIs
- recurring site-specific presets for known research workflows

## Summary

In HEM-CM, adapters are not just fetchers. They are the trust boundary and normalization boundary between the external web and the internal event engine.

If adapter outputs stay clean, the rest of the repository remains modular, explainable, and much easier to evolve.
