import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { ensureDatabaseSeeded } from "@/lib/seed-db";
import { applyDemoRuntime } from "@/lib/demo-runtime";
import { DEFAULT_LOCALE, type Locale, getFamilyLabels, getHorizonLabels, getMarketLabels, getStageLabels } from "@/lib/i18n";
import { formatScore } from "@/lib/utils";

function jsonArray<T>(value: Prisma.JsonValue | null | undefined) {
  return (Array.isArray(value) ? value : []) as T[];
}

function jsonObject<T>(value: Prisma.JsonValue | null | undefined) {
  return ((value && typeof value === "object" && !Array.isArray(value) ? value : {}) as unknown) as T;
}

async function getRuntimePreference() {
  const preference = await prisma.userPreference.findUnique({
    where: { key: "default" },
    select: { demoMode: true, refreshMinutes: true }
  });

  return {
    demoMode: preference?.demoMode ?? true,
    refreshMinutes: preference?.refreshMinutes ?? 15
  };
}

export async function getDashboardData(filters?: { q?: string; family?: string }, locale: Locale = DEFAULT_LOCALE) {
  await ensureDatabaseSeeded();
  const runtimePreference = await getRuntimePreference();
  const familyLabels = getFamilyLabels(locale);
  const marketLabels = getMarketLabels(locale);
  const stageLabels = getStageLabels(locale);

  const where: Prisma.EventWhereInput = {
    ...(filters?.family && filters.family !== "ALL" ? { familyType: filters.family as never } : {}),
    ...(filters?.q
      ? {
          OR: [
            { title: { contains: filters.q } },
            { summary: { contains: filters.q } }
          ]
        }
      : {})
  };

  const [events, signals, impacts] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: [{ severityScore: "desc" }, { latestUpdateTime: "desc" }],
      include: { predictions: true }
    }),
    prisma.signal.findMany({
      orderBy: { publishTime: "desc" },
      take: 12,
      include: { event: true }
    }),
    prisma.marketImpact.findMany({
      where: { event: { ...where } },
      orderBy: [{ strengthScore: "desc" }],
      take: 60
    })
  ]);

  const runtime = applyDemoRuntime({
    events,
    signals,
    options: runtimePreference
  });
  const liveEvents = runtime.events;
  const liveSignals = runtime.signals;

  const globalRisk = formatScore(liveEvents.reduce((sum, event) => sum + event.severityScore, 0) / Math.max(1, liveEvents.length));
  const highRiskCount = liveEvents.filter((event) => event.severityScore >= 76).length;
  const newHighImpactCount = liveEvents.filter((event) => event.confidenceScore >= 80 && event.sourceCount >= 4).length;

  const heatmap = Object.entries(familyLabels).map(([familyType, label]) => {
    const familyEvents = liveEvents.filter((event) => event.familyType === familyType);
    return {
      familyType,
      label,
      score: formatScore(familyEvents.reduce((sum, event) => sum + event.severityScore, 0) / Math.max(1, familyEvents.length)),
      count: familyEvents.length
    };
  });

  const marketOverview = Object.entries(marketLabels).map(([market, label]) => {
    const scoped = impacts.filter((impact) => impact.market === market);
    const positive = scoped.filter((impact) => impact.direction === "POSITIVE").sort((a, b) => b.strengthScore - a.strengthScore)[0];
    const negative = scoped.filter((impact) => impact.direction === "NEGATIVE").sort((a, b) => b.strengthScore - a.strengthScore)[0];
    return {
      market,
      label,
      score: formatScore(scoped.reduce((sum, item) => sum + item.strengthScore, 0) / Math.max(1, scoped.length)),
      positive,
      negative
    };
  });

  return {
    metrics: {
      todayHotEvents: liveEvents.length,
      highRiskCount,
      newHighImpactCount,
      globalRisk
    },
    featuredEvents: liveEvents.map((event) => ({
      id: event.id,
      title: event.title,
      familyLabel: familyLabels[event.familyType],
      stageLabel: stageLabels[event.currentStage],
      severityScore: event.severityScore,
      confidenceScore: event.confidenceScore,
      summary: event.summary,
      tags: jsonArray<string>(event.tags),
      topPath: event.predictions.sort((a, b) => b.probability - a.probability)[0]
    })),
    heatmap,
    marketOverview,
    signals: liveSignals.map((signal) => ({
      id: signal.id,
      headline: signal.headline,
      eventId: signal.eventId,
      eventTitle: signal.event.title,
      publishTime: signal.publishTime,
      confidenceScore: signal.confidenceScore,
      sourceName: signal.sourceName,
      entersModel: signal.entersModel
    }))
  };
}

export async function getEventDetail(eventId: string) {
  await ensureDatabaseSeeded();
  const runtimePreference = await getRuntimePreference();
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      actors: true,
      signals: { orderBy: { publishTime: "desc" } },
      predictions: { orderBy: [{ horizon: "asc" }, { probability: "desc" }] },
      marketImpacts: true,
      sectorImpacts: true,
      backtestRuns: true
    }
  });

  if (!event) return null;

  const runtime = applyDemoRuntime({
    events: [event],
    signals: event.signals,
    options: runtimePreference
  });
  const liveEvent = runtime.events[0];
  const liveSignals = runtime.signals;

  return {
    ...liveEvent,
    signals: liveSignals,
    regions: jsonArray<string>(liveEvent.regions),
    tags: jsonArray<string>(liveEvent.tags),
    actorNames: jsonArray<string>(liveEvent.actorNames),
    driverSummary: jsonArray<string>(liveEvent.driverSummary),
    constraintSummary: jsonArray<string>(liveEvent.constraintSummary),
    triggerSummary: jsonArray<string>(liveEvent.triggerSummary),
    causalChain: jsonObject<{ nodes: unknown[]; edges: unknown[] }>(liveEvent.causalChain),
    motherModel: jsonObject<Record<string, unknown>>(liveEvent.motherModel),
    marketTransmission: jsonArray<string>(liveEvent.marketTransmission),
    explanation: jsonObject<Record<string, string>>(liveEvent.explanation),
    backtest: liveEvent.backtestRuns[0] ?? null
  };
}

export async function getMarketsData(selectedEventId?: string) {
  await ensureDatabaseSeeded();
  const runtimePreference = await getRuntimePreference();
  const [events, signals] = await Promise.all([
    prisma.event.findMany({
      include: { marketImpacts: true, predictions: true }
    }),
    prisma.signal.findMany({
      orderBy: [{ priorityScore: "desc" }, { publishTime: "desc" }]
    })
  ]);

  const runtime = applyDemoRuntime({
    events,
    signals,
    options: runtimePreference
  });
  const liveEvents = runtime.events;
  const selectedEvent = selectedEventId ? liveEvents.find((event) => event.id === selectedEventId) ?? liveEvents[0] : liveEvents[0];
  const impacts = await prisma.marketImpact.findMany({
    where: { eventId: selectedEvent.id },
    orderBy: [{ strengthScore: "desc" }]
  });

  const eventScore = formatScore(selectedEvent.severityScore * 0.46 + selectedEvent.confidenceScore * 0.24 + selectedEvent.sourceCount * 3.4);
  const pricedIn = formatScore(impacts.reduce((sum, impact) => sum + impact.pricedInScore, 0) / Math.max(1, impacts.length));
  const expectationGap = formatScore(Math.max(0, eventScore - pricedIn));

  return {
    events: liveEvents.map((event) => ({ id: event.id, title: event.title })),
    selectedEvent,
    summary: {
      eventDriveScore: eventScore,
      pricedIn,
      expectationGap
    },
    rankings: {
      aSharePositive: impacts.filter((item) => item.market === "A_SHARE" && item.direction === "POSITIVE").sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 6),
      aShareNegative: impacts.filter((item) => item.market === "A_SHARE" && item.direction === "NEGATIVE").sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 6),
      usPositive: impacts.filter((item) => item.market === "US_EQUITY" && item.direction === "POSITIVE").sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 6),
      usNegative: impacts.filter((item) => item.market === "US_EQUITY" && item.direction === "NEGATIVE").sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 6),
      commodities: impacts.filter((item) => item.market === "COMMODITY").sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 5),
      riskOff: impacts.filter((item) => item.market === "MACRO").sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 4)
    }
  };
}

export async function getBacktestsData(selectedEventId?: string) {
  await ensureDatabaseSeeded();
  const backtests = await prisma.backtestRun.findMany({
    include: { event: true },
    orderBy: { predictionHitRate: "desc" }
  });

  const selected = selectedEventId ? backtests.find((item) => item.eventId === selectedEventId) ?? backtests[0] : backtests[0];

  return {
    items: backtests.map((item) => ({
      id: item.eventId,
      title: item.event.title,
      replayWindow: item.replayWindow,
      predictionHitRate: item.predictionHitRate,
      marketFitScore: item.marketFitScore
    })),
    selected: selected
      ? {
          ...selected,
          timeline: jsonArray<Record<string, unknown>>(selected.timeline),
          predictionSnapshot: jsonArray<Record<string, unknown>>(selected.predictionSnapshot),
          actualOutcome: jsonObject<Record<string, unknown>>(selected.actualOutcome),
          marketOutcome: jsonObject<Record<string, unknown>>(selected.marketOutcome),
          errorAnalysis: jsonObject<Record<string, unknown>>(selected.errorAnalysis)
        }
      : null
  };
}

export async function getSignalsData() {
  await ensureDatabaseSeeded();
  const runtimePreference = await getRuntimePreference();
  const [signals, events] = await Promise.all([
    prisma.signal.findMany({
      orderBy: [{ priorityScore: "desc" }, { publishTime: "desc" }],
      include: { event: true }
    }),
    prisma.event.findMany({ orderBy: { severityScore: "desc" } })
  ]);

  const runtime = applyDemoRuntime({
    events,
    signals,
    options: runtimePreference
  });
  const liveSignals = runtime.signals;
  const liveEvents = runtime.events;

  const aggregated = liveEvents.map((event) => {
    const eventSignals = liveSignals.filter((signal) => signal.eventId === event.id);
    return {
      eventId: event.id,
      title: event.title,
      confirmationCount: new Set(eventSignals.map((signal) => signal.mergedKey)).size,
      entersModel: eventSignals.some((signal) => signal.entersModel),
      confidenceTrend: formatScore(eventSignals.reduce((sum, signal) => sum + signal.confidenceScore, 0) / Math.max(1, eventSignals.length)),
      topSignal: eventSignals[0]
    };
  });

  return {
    stream: liveSignals,
    aggregated
  };
}

export async function getModelsData() {
  await ensureDatabaseSeeded();
  const [models, sources] = await Promise.all([prisma.modelConfig.findMany({ orderBy: [{ active: "desc" }, { familyType: "asc" }] }), prisma.sourceConfig.findMany()]);

  return {
    models: models.map((model) => ({
      ...model,
      weights: jsonObject<Record<string, number>>(model.weights),
      variables: jsonArray<string>(model.variables),
      mappingMatrix: jsonObject<Record<string, number>>(model.mappingMatrix),
      pathTemplates: jsonArray<Record<string, unknown>>(model.pathTemplates),
      sourceRules: jsonObject<Record<string, unknown>>(model.sourceRules),
      thresholds: jsonObject<Record<string, number>>(model.thresholds),
      visualFocus: jsonArray<string>(model.visualFocus)
    })),
    sources: sources.map((source) => ({
      ...source,
      ruleConfig: jsonObject<Record<string, unknown>>(source.ruleConfig)
    }))
  };
}

export async function getSettingsData() {
  await ensureDatabaseSeeded();
  const [preference, sources] = await Promise.all([
    prisma.userPreference.findUnique({ where: { key: "default" } }),
    prisma.sourceConfig.findMany({ orderBy: { sourceGrade: "asc" } })
  ]);

  return {
    preference: preference
      ? {
          ...preference,
          preferredMarkets: jsonArray<string>(preference.preferredMarkets),
          savedFilters: jsonObject<Record<string, string>>(preference.savedFilters),
          value: jsonObject<Record<string, unknown>>(preference.value)
        }
      : null,
    sources: sources.map((source) => ({
      ...source,
      ruleConfig: jsonObject<Record<string, unknown>>(source.ruleConfig)
    }))
  };
}

export async function exportEventBundle(eventId: string, locale: Locale = DEFAULT_LOCALE) {
  const detail = await getEventDetail(eventId);
  if (!detail) return null;

  return {
    exportedAt: new Date().toISOString(),
    horizons: Object.values(getHorizonLabels(locale)),
    event: detail
  };
}
