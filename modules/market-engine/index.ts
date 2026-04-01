import type { MarketCode } from "@prisma/client";

import {
  A_SHARE_SECTORS,
  COMMODITY_BUCKETS,
  DOMESTIC_IMPACTS,
  MACRO_BUCKETS,
  US_SECTORS
} from "@/lib/constants";
import { scoreDirection, clamp, formatScore } from "@/lib/utils";
import { DEFAULT_THRESHOLDS, FAMILY_MAPPING_MATRICES } from "@/modules/config-engine/default-config";
import type { ImpactOutput, SectorOutput } from "@/lib/types";

type MarketInput = {
  eventId: string;
  familyType: string;
  stageLabel: string;
  severityScore: number;
  confidenceScore: number;
  signalPriority: number;
  topPathProbability: number;
};

const universeByMarket: Record<MarketCode, readonly string[]> = {
  CN_SOCIETY: DOMESTIC_IMPACTS,
  A_SHARE: A_SHARE_SECTORS,
  US_EQUITY: US_SECTORS,
  COMMODITY: COMMODITY_BUCKETS,
  MACRO: MACRO_BUCKETS
};

export function buildMarketImpacts(input: MarketInput) {
  const matrix = FAMILY_MAPPING_MATRICES[input.familyType] ?? {};
  const intensityFactor = input.severityScore / 100;
  const confirmationFactor = input.confidenceScore / 100;
  const stageFactor = input.signalPriority / 100;

  const impacts: ImpactOutput[] = [];
  const sectors: SectorOutput[] = [];

  (Object.keys(universeByMarket) as MarketCode[]).forEach((market) => {
    universeByMarket[market].forEach((sectorName, index) => {
      const exposure = matrix[sectorName] ?? 0;
      const signedScore = exposure * (45 + intensityFactor * 28 + confirmationFactor * 14 + stageFactor * 10);
      const direction = scoreDirection(50 + signedScore / 2) as ImpactOutput["direction"];
      const strengthScore = formatScore(clamp(Math.abs(signedScore) * (0.85 + input.topPathProbability / 240)));
      const pricedInScore = formatScore(
        clamp(input.signalPriority * 0.32 + input.confidenceScore * 0.26 + input.topPathProbability * 0.18 + (input.stageLabel.includes("兑现") ? 12 : 0))
      );
      const crowdingScore = formatScore(clamp(strengthScore * 0.55 + pricedInScore * 0.22 + Math.abs(exposure) * 25));

      impacts.push({
        market,
        assetClass:
          market === "COMMODITY" ? "COMMODITY" : market === "MACRO" ? "RATE_FX" : market === "CN_SOCIETY" ? "SENTIMENT" : "SECTOR",
        sectorName,
        direction,
        strengthScore,
        pricedInScore,
        crowdingScore,
        phaseTag:
          pricedInScore >= DEFAULT_THRESHOLDS.pricedInTrigger
            ? input.stageLabel.includes("对抗") || input.stageLabel.includes("扩散")
              ? "爆发"
              : "兑现"
            : "预热",
        summary: `${sectorName} 当前${direction === "POSITIVE" ? "受益" : direction === "NEGATIVE" ? "受损" : "影响中性"}，强度 ${strengthScore.toFixed(
          1
        )}。`,
        explanation: `映射引擎依据 ${input.familyType} 子模型矩阵、事件强度、信号确认和主路径概率共同打分，${sectorName} 的暴露系数为 ${exposure.toFixed(
          2
        )}。`,
        orderRank: index + 1
      });

      if (market === "A_SHARE" || market === "US_EQUITY") {
        sectors.push({
          market,
          sectorName,
          direction,
          score: strengthScore,
          confidenceScore: formatScore(clamp((input.confidenceScore + input.signalPriority) / 2)),
          explanation: `行业得分反映 ${sectorName} 对该事件的方向性敏感度与当前阶段暴露。`,
          benchmarkImpact: formatScore(Number((signedScore / 10).toFixed(2)))
        });
      }
    });
  });

  return { impacts, sectors };
}
