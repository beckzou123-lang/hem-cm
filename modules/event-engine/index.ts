import { buildCausalChain, buildMotherModel } from "@/modules/causal-engine";
import { classifyEvent } from "@/modules/classification-engine";
import { buildPredictions } from "@/modules/prediction-engine";
import { deriveStage } from "@/modules/stage-engine";
import { aggregateSignals, buildMergedKey, computeSignalMetrics } from "@/modules/signal-engine";
import { buildMarketImpacts } from "@/modules/market-engine";
import { buildBacktestRun } from "@/modules/backtest-engine";
import { STAGE_LABELS } from "@/lib/constants";
import { clamp, formatScore } from "@/lib/utils";
import type { RawEventSample } from "@/lib/types";

export function buildEventBundle(sample: RawEventSample, options?: { includeBacktest?: boolean }) {
  const classification = classifyEvent(sample);
  const stage = deriveStage(sample);
  const signalAggregate = aggregateSignals(sample.sourceInputs, sample.latestUpdateTime);
  const motherModel = buildMotherModel(sample);
  const causalChain = buildCausalChain(sample, motherModel);

  const severityScore = formatScore(clamp(sample.severityBase + signalAggregate.priorityScore * 0.12 + stage.stageIndex * 2));
  const confidenceScore = formatScore(clamp(sample.confidenceBase + signalAggregate.averageConfidence * 0.18));

  const predictions = buildPredictions({
    familyType: classification.familyType,
    severityScore,
    confidenceScore,
    stage: stage.stage,
    stageIndex: stage.stageIndex,
    signalPriority: signalAggregate.priorityScore,
    keyDrivers: sample.keyDrivers,
    keyConstraints: sample.keyConstraints,
    triggerSummary: sample.keyTriggers,
    motherModel
  });

  const topPath = predictions
    .filter((item) => item.horizon === "D30")
    .sort((a, b) => b.probability - a.probability)[0];

  const { impacts, sectors } = buildMarketImpacts({
    eventId: sample.id,
    familyType: classification.familyType,
    stageLabel: STAGE_LABELS[stage.stage],
    severityScore,
    confidenceScore,
    signalPriority: signalAggregate.priorityScore,
    topPathProbability: topPath?.probability ?? 33
  });

  const backtest = options?.includeBacktest === false ? null : buildBacktestRun(sample, predictions, sectors);

  return {
    cluster: {
      id: sample.clusterId,
      title: sample.baseTitle,
      familyType: classification.familyType,
      summary: `${sample.baseTitle} 已聚合 ${sample.sourceInputs.length} 条信号，形成统一主事件对象。`,
      confidenceScore,
      severityScore,
      tags: sample.tags
    },
    event: {
      id: sample.id,
      clusterId: sample.clusterId,
      title: sample.title,
      familyType: classification.familyType,
      subType: classification.subType,
      currentStage: stage.stage,
      severityScore,
      confidenceScore,
      summary: sample.summary,
      regions: sample.regions,
      tags: sample.tags,
      startTime: sample.startTime,
      latestUpdateTime: sample.latestUpdateTime,
      sourceCount: sample.sourceInputs.length,
      status: "ACTIVE" as const,
      stageExplanation: stage.explanation,
      actorNames: sample.actors.map((actor) => actor.name),
      driverSummary: sample.keyDrivers,
      constraintSummary: sample.keyConstraints,
      triggerSummary: sample.keyTriggers,
      causalChain,
      motherModel,
      marketTransmission: sample.marketTransmission,
      explanation: {
        classification: classification.explanation,
        signalAggregation: `信号聚合后确认数 ${signalAggregate.confirmationCount}，平均置信度 ${signalAggregate.averageConfidence}，进入主模型：${
          signalAggregate.entersModel ? "是" : "否"
        }。`,
        stage: stage.explanation,
        pricing: `已定价程度主要由阶段、信号确认和主路径概率共同估算。`
      }
    },
    actors: sample.actors,
    signals: sample.sourceInputs.map((signal) => {
      const metrics = computeSignalMetrics(signal, sample.latestUpdateTime);
      return {
        id: signal.id,
        signalType: signal.signalType,
        sourceType: signal.sourceType,
        sourceGrade: signal.sourceGrade,
        confidenceScore: metrics.confidenceScore,
        publishTime: signal.publishTime,
        decayWeight: metrics.decayWeight,
        validatedFlag: metrics.confidenceScore >= 66,
        rawPayload: signal.rawPayload,
        headline: signal.headline,
        summary: signal.summary,
        sourceName: signal.sourceName,
        mergedKey: buildMergedKey(signal.headline),
        entersModel: signalAggregate.entersModel,
        priorityScore: signalAggregate.priorityScore
      };
    }),
    predictions,
    impacts,
    sectors,
    backtest
  };
}
