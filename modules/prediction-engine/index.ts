import type { EventStage, Horizon } from "@prisma/client";

import { getFamilyConfig } from "@/modules/config-engine/default-config";
import { clamp, formatScore, normalizeToHundred } from "@/lib/utils";
import type { MotherModel, PathOutput } from "@/lib/types";

type PredictionInput = {
  familyType: string;
  severityScore: number;
  confidenceScore: number;
  stage: EventStage;
  stageIndex: number;
  signalPriority: number;
  keyDrivers: string[];
  keyConstraints: string[];
  triggerSummary: string[];
  motherModel: MotherModel;
};

const HORIZONS: Horizon[] = ["D7", "D30", "D90", "D180", "D365"];
const HORIZON_MULTIPLIER: Record<Horizon, number> = {
  D7: 1.15,
  D30: 1.08,
  D90: 1,
  D180: 0.94,
  D365: 0.88
};

export function buildPredictions(input: PredictionInput): PathOutput[] {
  const familyConfig = getFamilyConfig(input.familyType);
  const stageBias = familyConfig.stageBias[input.stage] ?? 0;
  const signalFactor = input.signalPriority * 0.25;
  const conflictBalance = input.motherModel.incentiveIntensity - input.motherModel.constraintIntensity;

  return HORIZONS.flatMap((horizon) => {
    const rawScores = familyConfig.pathTemplates.map((template) => {
      const horizonMultiplier = HORIZON_MULTIPLIER[horizon];
      return clamp(
        input.severityScore * familyConfig.weights.severity +
          input.confidenceScore * familyConfig.weights.confidence +
          input.motherModel.incentiveIntensity * 0.24 +
          input.motherModel.constraintIntensity * -0.18 +
          signalFactor +
          conflictBalance * 0.15 +
          stageBias +
          template.driverBias +
          template.constraintBias +
          horizonMultiplier * 6
      );
    });

    const normalized = normalizeToHundred(rawScores);

    return familyConfig.pathTemplates.map((template, index) => ({
      horizon,
      pathName: template.name,
      probability: formatScore(normalized[index]),
      keyDrivers: input.keyDrivers.slice(0, 3),
      keyConstraints: input.keyConstraints.slice(0, 3),
      invalidationSignals: [
        input.triggerSummary[index % Math.max(1, input.triggerSummary.length)] ?? "关键触发未持续",
        input.keyConstraints[index % Math.max(1, input.keyConstraints.length)] ?? "约束条件显著增强"
      ],
      expectedMarketEffect: `${template.narration} 重点映射至 ${familyConfig.marketFocus.slice(0, 3).join("、")}。`,
      explanation: `概率由严重度、信号确认、多空约束差和 ${horizon.replace("D", "")} 天时间窗修正共同决定；当前 ${template.name} 在 ${familyConfig.label} 子模型中得到 ${normalized[index].toFixed(2)}% 权重。`,
      conditions: [
        `若 ${input.keyDrivers[0] ?? "主驱动"} 持续强化，则路径更接近当前估计。`,
        `若 ${input.keyConstraints[0] ?? "约束因素"} 快速抬升，则该路径概率会下修。`
      ],
      pathRank: index + 1
    }));
  });
}
