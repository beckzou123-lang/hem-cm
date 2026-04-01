import type { SourceGrade } from "@prisma/client";

import { DEFAULT_SOURCE_RULES, DEFAULT_THRESHOLDS } from "@/modules/config-engine/default-config";
import { clamp, daysBetween, formatScore } from "@/lib/utils";
import type { RawSignalInput, SignalAggregate } from "@/lib/types";

const sourceGradeWeights: Record<SourceGrade, number> = {
  S: 1,
  A: 0.9,
  B: 0.72,
  C: 0.55
};

export function buildMergedKey(headline: string) {
  return headline
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .slice(0, 8)
    .join("-");
}

export function computeSignalMetrics(signal: RawSignalInput, latestUpdate: string) {
  const days = daysBetween(signal.publishTime, latestUpdate);
  const halfLife = DEFAULT_SOURCE_RULES.decayHalfLifeDays;
  const decayWeight = formatScore(Math.exp((-Math.log(2) * days) / halfLife) * 100) / 100;
  const base = sourceGradeWeights[signal.sourceGrade] * 100;
  const officialBoost = signal.sourceType === "GOVERNMENT" ? DEFAULT_SOURCE_RULES.officialBoost : 0;
  const confidenceScore = clamp(base * 0.68 + decayWeight * 18 + officialBoost + (signal.signalType === "MARKET" ? 4 : 0));

  return {
    decayWeight,
    confidenceScore: formatScore(confidenceScore)
  };
}

export function aggregateSignals(signals: RawSignalInput[], latestUpdate: string): SignalAggregate {
  const grouped = new Map<string, RawSignalInput[]>();
  for (const signal of signals) {
    const key = buildMergedKey(signal.headline);
    const bucket = grouped.get(key) ?? [];
    bucket.push(signal);
    grouped.set(key, bucket);
  }

  const confirmations = [...grouped.values()].reduce((max, bucket) => Math.max(max, bucket.length), 1);
  const metrics = signals.map((signal) => computeSignalMetrics(signal, latestUpdate).confidenceScore);
  const avg = metrics.reduce((sum, item) => sum + item, 0) / Math.max(1, metrics.length);
  const topGrade = signals
    .map((signal) => signal.sourceGrade)
    .sort((a, b) => sourceGradeWeights[b] - sourceGradeWeights[a])[0] as SourceGrade;
  const conflictSignals = grouped.size < Math.max(1, signals.length - 1) ? 0 : 1;
  const noisePenalty = conflictSignals * DEFAULT_SOURCE_RULES.noisePenaltyByConflict;
  const priorityScore = clamp(avg + confirmations * 3 - noisePenalty + (topGrade === "S" ? 8 : 0));
  const entersModel =
    priorityScore >= DEFAULT_THRESHOLDS.modelEntryConfidence &&
    (confirmations >= DEFAULT_SOURCE_RULES.minConfirmations || topGrade === "S");

  return {
    confirmationCount: confirmations,
    averageConfidence: formatScore(avg),
    topGrade,
    noisePenalty,
    entersModel,
    priorityScore: formatScore(priorityScore)
  };
}
