import type { FamilyType } from "@prisma/client";

import { getFamilyConfig } from "@/modules/config-engine/default-config";
import { clamp } from "@/lib/utils";
import type { RawEventSample } from "@/lib/types";

const keywordMap: Record<FamilyType, string[]> = {
  GEO_WAR: [
    "冲突",
    "打击",
    "导弹",
    "制裁",
    "军演",
    "航运",
    "边境",
    "防空",
    "中东",
    "乌克兰",
    "俄罗斯",
    "伊朗",
    "以色列",
    "conflict",
    "missile",
    "sanction",
    "shipping",
    "border",
    "defense",
    "middle east",
    "ukraine",
    "russia",
    "iran",
    "israel"
  ],
  TRADE_POLICY: ["关税", "贸易", "补贴", "出口管制", "政策", "供应链", "豁免", "调查", "进口", "tariff", "trade", "subsidy", "export control", "policy", "supply chain", "import"],
  REGULATION_LAW: ["监管", "调查", "禁令", "罚款", "裁决", "执法", "反垄断", "法律", "regulation", "investigation", "ban", "fine", "ruling", "enforcement", "antitrust", "law", "dma", "dsa"],
  CORPORATE_INDUSTRY: ["CEO", "事故", "停产", "供应链", "召回", "订单", "罢工", "工厂", "delivery", "factory", "recall", "accident", "outage", "supply chain", "order", "earnings"],
  SOCIAL_LABOR: ["罢工", "抗议", "工会", "社会冲突", "停工", "物流", "strike", "protest", "union", "shutdown", "dockworker", "port", "labor"],
  TECH_PLATFORM: ["平台", "模型", "算力", "数据泄露", "规则变化", "生态", "AI", "云服务", "platform", "model", "compute", "chip", "data leak", "cloud", "app store", "ecosystem"]
};

export function classifyEvent(sample: RawEventSample) {
  const haystack = [sample.title, sample.summary, sample.narrative, ...sample.familyHints, ...sample.tags, ...sample.subTypeHints]
    .join(" ")
    .toLowerCase();

  const scores = (Object.keys(keywordMap) as FamilyType[]).map((familyType) => {
    const matches = keywordMap[familyType].filter((keyword) => haystack.includes(keyword.toLowerCase())).length;
    const hintBonus = sample.familyHints.some((hint) => haystack.includes(hint.toLowerCase())) ? 8 : 0;
    return {
      familyType,
      score: clamp(matches * 11 + hintBonus + sample.confidenceBase * 0.15)
    };
  });

  const top = scores.sort((a, b) => b.score - a.score)[0];
  const familyConfig = getFamilyConfig(top.familyType);

  return {
    familyType: top.familyType,
    subType: sample.subTypeHints[0] ?? familyConfig.variables[0],
    explanation: `分类引擎根据关键词命中、事件标签和参与者语境判定为 ${familyConfig.label}，主因子集中在 ${familyConfig.variables.slice(0, 3).join("、")}。`,
    scores
  };
}
