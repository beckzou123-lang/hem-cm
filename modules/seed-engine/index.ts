import { DEFAULT_SOURCE_CONFIGS, DEFAULT_SOURCE_RULES, DEFAULT_THRESHOLDS, FAMILY_CONFIGS, FAMILY_MAPPING_MATRICES } from "@/modules/config-engine/default-config";
import { buildEventBundle } from "@/modules/event-engine";
import { rawEventSamples } from "@/data/seed/base-samples";

export function buildSeedBundle() {
  const eventBundles = rawEventSamples.map((sample) => buildEventBundle(sample));

  const modelConfigs = FAMILY_CONFIGS.map((config, index) => ({
    id: `model-${config.familyType.toLowerCase()}`,
    familyType: config.familyType,
    version: "hem-cm-v1.0",
    title: `${config.label} 子模型`,
    description: `${config.label} 子模型包含专属变量集、路径模板、市场映射矩阵和阈值规则。`,
    weights: config.weights,
    variables: config.variables,
    mappingMatrix: FAMILY_MAPPING_MATRICES[config.familyType],
    pathTemplates: config.pathTemplates,
    sourceRules: DEFAULT_SOURCE_RULES,
    thresholds: DEFAULT_THRESHOLDS,
    visualFocus: config.visualFocus,
    active: index < 3
  }));

  const globalConfig = {
    id: "model-global-mother",
    familyType: null,
    version: "hem-cm-v1.0",
    title: "通用因果母模型",
    description: "跨事件统一建模行为体、目标、激励、约束、触发、响应、扩散与市场中介变量。",
    weights: {
      actorGoal: 0.14,
      incentive: 0.18,
      constraint: 0.12,
      trigger: 0.14,
      responseElasticity: 0.1,
      diffusion: 0.14,
      marketMediator: 0.18
    },
    variables: ["行为体", "行为目标", "激励强度", "约束强度", "触发条件", "对手响应弹性", "扩散路径", "市场传导中介变量"],
    mappingMatrix: FAMILY_MAPPING_MATRICES,
    pathTemplates: FAMILY_CONFIGS.flatMap((config) => config.pathTemplates),
    sourceRules: DEFAULT_SOURCE_RULES,
    thresholds: DEFAULT_THRESHOLDS,
    visualFocus: ["因果链", "路径概率", "市场映射"],
    active: true
  };

  return {
    eventBundles,
    modelConfigs: [globalConfig, ...modelConfigs],
    sourceConfigs: DEFAULT_SOURCE_CONFIGS,
    alertRules: [
      {
        id: "alert-high-risk",
        eventId: "evt-mideast-iran-2026",
        name: "高风险地缘冲突预警",
        scope: "event",
        condition: { severityAbove: 85, confirmationAtLeast: 2 },
        enabled: true
      }
    ],
    userPreference: {
      id: "pref-default",
      key: "default",
      language: "en-US",
      theme: "SYSTEM",
      refreshMinutes: 15,
      preferredMarkets: ["A_SHARE", "US_EQUITY", "COMMODITY"],
      demoMode: true,
      savedFilters: { family: "ALL", sort: "severity" },
      exportFormat: "json",
      value: { homeLayout: "dense-terminal", watchlist: ["evt-mideast-iran-2026", "evt-trade-war-2026", "evt-russia-ukraine-2026"] }
    }
  };
}
