import type { EventStage } from "@prisma/client";

import { aggregateSignals } from "@/modules/signal-engine";
import { daysBetween } from "@/lib/utils";
import type { RawEventSample } from "@/lib/types";

const STAGE_ORDER: EventStage[] = [
  "LATENT",
  "HEATING",
  "TRIGGER",
  "DIFFUSION",
  "CONFRONTATION",
  "NEGOTIATION",
  "REALIZATION",
  "DECAY"
];

export function deriveStage(sample: RawEventSample): { stage: EventStage; explanation: string; stageIndex: number } {
  const signalAggregate = aggregateSignals(sample.sourceInputs, sample.latestUpdateTime);
  const lifeDays = daysBetween(sample.startTime, sample.latestUpdateTime);
  const lastHeadline = sample.sourceInputs
    .slice()
    .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())[0]?.headline;

  let stage: EventStage = "HEATING";
  if (lifeDays > 700 && signalAggregate.priorityScore < 66) {
    stage = "DECAY";
  } else if (/谈判|会晤|停火|磋商/u.test(lastHeadline ?? "")) {
    stage = "NEGOTIATION";
  } else if (sample.severityBase >= 78 && signalAggregate.confirmationCount >= 2) {
    stage = "CONFRONTATION";
  } else if (sample.severityBase >= 72) {
    stage = "DIFFUSION";
  } else if (lifeDays < 30) {
    stage = "TRIGGER";
  } else if (sample.severityBase >= 65) {
    stage = "REALIZATION";
  }

  return {
    stage,
    stageIndex: STAGE_ORDER.indexOf(stage),
    explanation: `阶段识别综合了事件生命周期 ${lifeDays} 天、近端信号优先级 ${signalAggregate.priorityScore}、多源确认数 ${signalAggregate.confirmationCount} 与最新触发表述，当前判定为 ${stage}。`
  };
}
