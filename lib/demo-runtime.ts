import { clamp, formatScore } from "@/lib/utils";

type EventRuntimeShape = {
  id: string;
  severityScore: number;
  confidenceScore: number;
  sourceCount: number;
  latestUpdateTime: Date | string;
};

type SignalRuntimeShape = {
  id: string;
  eventId: string;
  publishTime: Date | string;
  confidenceScore: number;
  priorityScore: number;
  decayWeight: number;
  entersModel: boolean;
  sourceGrade?: string;
};

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function wave(seed: string, cycle: number, phase = 0) {
  return Math.sin(hashString(seed) * 0.017 + cycle * 0.83 + phase);
}

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

type DemoRuntimeOptions = {
  demoMode: boolean;
  refreshMinutes: number;
  now?: Date;
};

export function applyDemoRuntime<TEvent extends EventRuntimeShape, TSignal extends SignalRuntimeShape>({
  events,
  signals,
  options
}: {
  events: TEvent[];
  signals: TSignal[];
  options: DemoRuntimeOptions;
}) {
  if (!options.demoMode) {
    return {
      events,
      signals,
      cycleStartedAt: null as Date | null
    };
  }

  const refreshMinutes = Math.max(5, Math.min(60, options.refreshMinutes || 15));
  const now = options.now ?? new Date();
  const cycle = Math.floor(now.getTime() / (refreshMinutes * 60_000));

  const groupedSignals = new Map<string, TSignal[]>();
  for (const signal of signals) {
    const eventSignals = groupedSignals.get(signal.eventId) ?? [];
    eventSignals.push(signal);
    groupedSignals.set(signal.eventId, eventSignals);
  }

  const eventBase = events.map((event) => {
    const signalCount = groupedSignals.get(event.id)?.length ?? event.sourceCount;
    const severityPulse = wave(`${event.id}:severity`, cycle, 0.4);
    const confidencePulse = wave(`${event.id}:confidence`, cycle, 1.2);
    const liveSeverity = formatScore(clamp(event.severityScore + severityPulse * 4.8 + signalCount * 0.4));
    const liveConfidence = formatScore(clamp(event.confidenceScore + confidencePulse * 6.2 + signalCount * 0.35));
    const activityScore = liveSeverity * 0.58 + liveConfidence * 0.24 + signalCount * 3.2 + Math.max(0, severityPulse) * 6.5;

    return {
      ...event,
      severityScore: liveSeverity,
      confidenceScore: liveConfidence,
      __activityScore: activityScore
    };
  });

  const eventOrder = [...eventBase].sort((left, right) => {
    if (right.__activityScore !== left.__activityScore) {
      return right.__activityScore - left.__activityScore;
    }

    return toDate(right.latestUpdateTime).getTime() - toDate(left.latestUpdateTime).getTime();
  });

  const eventOffsets = new Map<string, number>();
  eventOrder.forEach((event, index) => {
    const pulse = wave(`${event.id}:freshness`, cycle, 2.1);
    const baseHours = index * 8 + Math.max(1, Math.round((1 - pulse) * 2));
    eventOffsets.set(event.id, baseHours);
  });

  const signalRanks = new Map<string, Map<string, number>>();
  for (const [eventId, eventSignals] of groupedSignals.entries()) {
    const ordered = [...eventSignals].sort((left, right) => toDate(right.publishTime).getTime() - toDate(left.publishTime).getTime());
    const rankMap = new Map<string, number>();
    ordered.forEach((signal, index) => {
      rankMap.set(signal.id, index);
    });
    signalRanks.set(eventId, rankMap);
  }

  const liveSignals = signals
    .map((signal) => {
      const eventBaseHours = eventOffsets.get(signal.eventId) ?? 24;
      const localRank = signalRanks.get(signal.eventId)?.get(signal.id) ?? 0;
      const freshnessWave = wave(`${signal.id}:freshness`, cycle, 2.8);
      const freshnessHours = Math.max(1, eventBaseHours + localRank * 3 + Math.max(0, Math.round((1 - freshnessWave) * 2)));
      const publishTime = new Date(now.getTime() - freshnessHours * 3_600_000);
      const liveConfidence = formatScore(clamp(signal.confidenceScore + wave(`${signal.id}:confidence`, cycle, 0.7) * 7.5));
      const livePriority = formatScore(clamp(signal.priorityScore + liveConfidence * 0.08 + Math.max(0, 30 - freshnessHours) * 0.9));
      const entersModel = signal.entersModel || liveConfidence >= 76 || livePriority >= 78;
      const decayWeight = formatScore(clamp(100 - freshnessHours * 2.6));

      return {
        ...signal,
        publishTime,
        confidenceScore: liveConfidence,
        priorityScore: livePriority,
        decayWeight,
        entersModel
      };
    })
    .sort((left, right) => {
      if (right.priorityScore !== left.priorityScore) {
        return right.priorityScore - left.priorityScore;
      }

      return toDate(right.publishTime).getTime() - toDate(left.publishTime).getTime();
    });

  const liveSignalGroups = new Map<string, TSignal[]>();
  for (const signal of liveSignals) {
    const eventSignals = liveSignalGroups.get(signal.eventId) ?? [];
    eventSignals.push(signal);
    liveSignalGroups.set(signal.eventId, eventSignals);
  }

  const liveEvents = eventBase
    .map((event) => {
      const eventSignals = liveSignalGroups.get(event.id) ?? [];
      const avgConfidence =
        eventSignals.reduce((sum, signal) => sum + signal.confidenceScore, 0) / Math.max(1, eventSignals.length);
      const topPriority = eventSignals[0]?.priorityScore ?? 0;
      const liveConfidence = formatScore(clamp(event.confidenceScore * 0.62 + avgConfidence * 0.38));
      const liveSeverity = formatScore(clamp(event.severityScore + Math.max(0, topPriority - 70) * 0.12));
      const latestUpdateTime = eventSignals[0]?.publishTime ?? toDate(event.latestUpdateTime);

      return {
        ...event,
        confidenceScore: liveConfidence,
        severityScore: liveSeverity,
        latestUpdateTime
      };
    })
    .sort((left, right) => {
      const leftTopPriority = liveSignalGroups.get(left.id)?.[0]?.priorityScore ?? 0;
      const rightTopPriority = liveSignalGroups.get(right.id)?.[0]?.priorityScore ?? 0;
      const leftScore = left.severityScore * 0.56 + left.confidenceScore * 0.22 + leftTopPriority * 0.22;
      const rightScore = right.severityScore * 0.56 + right.confidenceScore * 0.22 + rightTopPriority * 0.22;

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return toDate(right.latestUpdateTime).getTime() - toDate(left.latestUpdateTime).getTime();
    });

  return {
    events: liveEvents,
    signals: liveSignals,
    cycleStartedAt: new Date(cycle * refreshMinutes * 60_000)
  };
}
