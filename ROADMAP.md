# HEM-CM Roadmap

This roadmap focuses on the next steps for turning HEM-CM from a strong local event-intelligence terminal into a durable open-source platform for event-driven market research.

## Now

These foundations are already in place:

- English-first bilingual repository and product surface
- Global Overview, Event War Room, Market Desk, Signal Monitor, Backtest Lab, and Model Center
- Prisma + SQLite local-first stack
- Seeded demo data and validation flow
- GitHub launch assets, release notes, and first public release

## Next

### 1. Source Intelligence

- Add more live-source adapters beyond Google News, RSS, JSON feeds, and static webpages
- Improve extraction stability across inconsistent article layouts
- Add source trust scoring and better deduplication logic
- Support reusable ingestion presets for recurring research workflows

### 2. Model Transparency

- Expand parent-model and sub-model documentation
- Surface clearer “why this stage / why this path” evidence panels
- Add explicit invalidation tracking for scenario paths
- Make model parameter changes easier to diff across versions

### 3. Replay & Evaluation

- Add richer replay metrics beyond hit rate and fit score
- Track forecast drift between model versions
- Improve timeline comparison for forecast vs realized outcomes
- Add reusable benchmark event sets for regression-style evaluation

### 4. Product Workflow

- Enable collaborative annotations and researcher notes
- Add saved views and watchlist-oriented research workflows
- Improve export packaging for event bundles and market mappings
- Add more opinionated onboarding for first-time users

### 5. AI-Ready Tooling

- Add optional evidence summarization modules
- Add structured prompt/export surfaces for downstream model usage
- Add agent-ready event bundle formats for external copilots
- Keep explainability as the default, not an afterthought

## Later

### 1. Broader Coverage

- Add more event families and specialized sub-model templates
- Expand asset coverage and region-specific market mappings
- Add macro and policy transmission templates

### 2. Collaboration Layer

- Discussion-first research review workflows
- Shared model libraries and reusable scenario templates
- Contributor-facing extension kits for new event families and adapters

### 3. Deployment Options

- Optional hosted demo or sandbox deployment
- More production-oriented database and job-runner support
- Better team-level auth and workspace separation

## Contribution Priorities

The highest-value contributions right now are:

- new source adapters
- model transparency improvements
- replay metric design
- documentation and onboarding refinement
- example datasets and benchmark event cases

## Principles

- Explainability before complexity
- Local-first before infrastructure-heavy expansion
- Event reasoning before dashboard cosmetics
- Reusable primitives before one-off workflows
