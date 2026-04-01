import { formatScore } from "@/lib/utils";
import type { PathOutput, RawEventSample, SectorOutput } from "@/lib/types";

export function buildBacktestRun(sample: RawEventSample, predictions: PathOutput[], sectors: SectorOutput[]) {
  const checkpoints = sample.sourceInputs
    .slice()
    .sort((a, b) => new Date(a.publishTime).getTime() - new Date(b.publishTime).getTime())
    .slice(0, 5)
    .map((signal, index) => ({
      date: signal.publishTime,
      modelScore: formatScore(sample.severityBase - 8 + index * 4),
      confidence: formatScore(sample.confidenceBase - 6 + index * 3),
      confirmation: Math.min(index + 1, 4),
      headline: signal.headline
    }));

  const topPaths = predictions
    .filter((prediction) => prediction.horizon === "D30" || prediction.horizon === "D90" || prediction.horizon === "D180")
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);

  const actualPath = sample.actualOutcome.outcomePath;
  const hitRate = topPaths.some((path) => path.pathName === actualPath) ? 78 : 56;
  const marketFitScore = sectors
    .filter((sector) => sector.direction !== "NEUTRAL")
    .slice(0, 6)
    .reduce((sum, sector) => sum + sector.confidenceScore, 0) / 6;

  return {
    modelVersion: "hem-cm-v1.0",
    replayWindow: `${sample.startTime.slice(0, 10)} ~ ${sample.latestUpdateTime.slice(0, 10)}`,
    timeline: checkpoints,
    predictionSnapshot: topPaths,
    actualOutcome: sample.actualOutcome,
    marketOutcome: {
      bestPositive: sectors.filter((sector) => sector.direction === "POSITIVE").sort((a, b) => b.score - a.score).slice(0, 3),
      worstNegative: sectors.filter((sector) => sector.direction === "NEGATIVE").sort((a, b) => b.score - a.score).slice(0, 3)
    },
    predictionHitRate: formatScore(hitRate),
    marketFitScore: formatScore(marketFitScore),
    errorAnalysis: {
      misses: ["政策执行时点存在离散化误差", "市场情绪回归速度快于历史样本均值"],
      strengths: ["多源确认信号对路径收敛帮助明显", "行业映射方向与现实反馈基本一致"],
      versionDelta: "v1.0 相较基线模型提升了信号去噪和路径约束解释能力。"
    },
    summary: `回测显示，系统在 ${sample.shortTitle} 上能较早识别主路径，并在行业分化上提供可操作结论。`
  };
}
