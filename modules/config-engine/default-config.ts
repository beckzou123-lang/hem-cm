import { DOMESTIC_IMPACTS, A_SHARE_SECTORS, US_SECTORS, COMMODITY_BUCKETS, MACRO_BUCKETS } from "@/lib/constants";
import type { FamilyConfig } from "@/lib/types";

export const FAMILY_CONFIGS: FamilyConfig[] = [
  {
    familyType: "GEO_WAR",
    label: "地缘 / 战争",
    variables: ["军事升级强度", "能源通道扰动", "联盟介入力度", "制裁风险", "航运风险"],
    weights: {
      severity: 0.28,
      confidence: 0.18,
      incentive: 0.2,
      constraint: -0.12,
      signalConfirmation: 0.14,
      marketTransmission: 0.12,
      stage: 0.08
    },
    stageBias: {
      LATENT: -6,
      HEATING: 4,
      TRIGGER: 8,
      DIFFUSION: 10,
      CONFRONTATION: 14,
      NEGOTIATION: -4,
      REALIZATION: -2,
      DECAY: -10
    },
    pathTemplates: [
      { name: "冲突外溢升级", driverBias: 18, constraintBias: -8, narration: "高强度打击、能源与航运扰动放大，市场重新计入风险溢价。" },
      { name: "有限对抗延续", driverBias: 10, constraintBias: 2, narration: "冲突维持局部化，市场在高波动中消化但未演变为全面失控。" },
      { name: "降级与谈判回归", driverBias: -10, constraintBias: 18, narration: "约束机制生效，风险溢价回吐，资产表现回归基本面。" }
    ],
    marketFocus: ["原油", "黄金", "航运", "军工", "美元指数"],
    visualFocus: ["扩散路径", "市场传导链", "对手响应"]
  },
  {
    familyType: "TRADE_POLICY",
    label: "贸易 / 政策",
    variables: ["关税强度", "政策执行时点", "供应链替代能力", "通胀传导", "产业补贴"],
    weights: {
      severity: 0.22,
      confidence: 0.18,
      incentive: 0.17,
      constraint: -0.1,
      signalConfirmation: 0.15,
      marketTransmission: 0.18,
      stage: 0.1
    },
    stageBias: {
      LATENT: -4,
      HEATING: 6,
      TRIGGER: 12,
      DIFFUSION: 10,
      CONFRONTATION: 6,
      NEGOTIATION: 2,
      REALIZATION: 5,
      DECAY: -8
    },
    pathTemplates: [
      { name: "关税升级扩围", driverBias: 16, constraintBias: -6, narration: "政策冲突从单一品类扩至更大供应链，通胀与替代逻辑并行。" },
      { name: "结构性摩擦常态化", driverBias: 8, constraintBias: 4, narration: "政策维持高压但扩围有限，市场转向交易受益与受损的结构分化。" },
      { name: "谈判缓和与豁免扩展", driverBias: -8, constraintBias: 16, narration: "政策边际缓和，供应链冲击减弱，交易拥挤度下降。" }
    ],
    marketFocus: ["半导体", "新能源", "汽车", "输入性通胀", "美国利率预期"],
    visualFocus: ["产业链映射", "预期差", "已定价程度"]
  },
  {
    familyType: "REGULATION_LAW",
    label: "监管 / 法律",
    variables: ["执法力度", "规则明确性", "处罚范围", "行业连带性", "诉讼时长"],
    weights: {
      severity: 0.2,
      confidence: 0.2,
      incentive: 0.14,
      constraint: -0.14,
      signalConfirmation: 0.18,
      marketTransmission: 0.14,
      stage: 0.1
    },
    stageBias: {
      LATENT: -2,
      HEATING: 6,
      TRIGGER: 12,
      DIFFUSION: 8,
      CONFRONTATION: 4,
      NEGOTIATION: -2,
      REALIZATION: 10,
      DECAY: -8
    },
    pathTemplates: [
      { name: "执法升级与外溢扩散", driverBias: 14, constraintBias: -5, narration: "监管对象外溢到同类平台或供应商，估值与规则预期同步承压。" },
      { name: "规则落地后分化交易", driverBias: 6, constraintBias: 5, narration: "市场逐步把处罚变成分化定价，更重视执行细则与合规成本。" },
      { name: "和解或延缓执行", driverBias: -6, constraintBias: 14, narration: "执法节奏放缓，估值杀伤减弱，但主题热度同步回落。" }
    ],
    marketFocus: ["科技成长", "可选消费", "半导体", "防御型资产"],
    visualFocus: ["规则依据", "处罚范围", "连带风险"]
  },
  {
    familyType: "CORPORATE_INDUSTRY",
    label: "企业 / 产业",
    variables: ["产能冲击", "订单可替代性", "治理可信度", "安全事故等级", "供应链恢复速度"],
    weights: {
      severity: 0.23,
      confidence: 0.16,
      incentive: 0.14,
      constraint: -0.12,
      signalConfirmation: 0.15,
      marketTransmission: 0.2,
      stage: 0.12
    },
    stageBias: {
      LATENT: -3,
      HEATING: 7,
      TRIGGER: 12,
      DIFFUSION: 10,
      CONFRONTATION: 2,
      NEGOTIATION: 0,
      REALIZATION: 8,
      DECAY: -8
    },
    pathTemplates: [
      { name: "事故冲击深化", driverBias: 12, constraintBias: -4, narration: "经营或供应链风险未止血，利润与估值同时承压。" },
      { name: "修复与替代并行", driverBias: 6, constraintBias: 6, narration: "主线是修复节奏与替代者受益，市场呈双边交易。" },
      { name: "治理改善带动重估", driverBias: -2, constraintBias: 12, narration: "管理改善和执行修复占上风，风险折价逐步收敛。" }
    ],
    marketFocus: ["航空", "工业", "汽车", "化工", "供应链"],
    visualFocus: ["事故影响", "产能恢复", "替代受益"]
  },
  {
    familyType: "SOCIAL_LABOR",
    label: "社会 / 劳工",
    variables: ["参与规模", "谈判僵局", "物流阻断", "成本传导", "舆情扩散"],
    weights: {
      severity: 0.22,
      confidence: 0.17,
      incentive: 0.15,
      constraint: -0.12,
      signalConfirmation: 0.16,
      marketTransmission: 0.18,
      stage: 0.12
    },
    stageBias: {
      LATENT: -4,
      HEATING: 8,
      TRIGGER: 12,
      DIFFUSION: 10,
      CONFRONTATION: 8,
      NEGOTIATION: 2,
      REALIZATION: 6,
      DECAY: -10
    },
    pathTemplates: [
      { name: "罢工升级与物流瓶颈", driverBias: 15, constraintBias: -5, narration: "停工或运输瓶颈持续，带来成本与交付扰动。" },
      { name: "局部扰动后谈判拉锯", driverBias: 8, constraintBias: 5, narration: "事件对供应链形成阶段性影响，但未演化为系统性冲击。" },
      { name: "快速达成协议", driverBias: -7, constraintBias: 14, narration: "压力快速释放，市场回吐风险溢价。" }
    ],
    marketFocus: ["航运", "航空", "消费", "输入性通胀", "风险偏好"],
    visualFocus: ["参与人数", "物流节点", "谈判进度"]
  },
  {
    familyType: "TECH_PLATFORM",
    label: "科技 / 平台",
    variables: ["平台规则变化", "算力需求", "数据安全", "开发者生态", "资本开支"],
    weights: {
      severity: 0.18,
      confidence: 0.2,
      incentive: 0.18,
      constraint: -0.1,
      signalConfirmation: 0.16,
      marketTransmission: 0.18,
      stage: 0.1
    },
    stageBias: {
      LATENT: -2,
      HEATING: 8,
      TRIGGER: 12,
      DIFFUSION: 10,
      CONFRONTATION: 2,
      NEGOTIATION: -2,
      REALIZATION: 7,
      DECAY: -8
    },
    pathTemplates: [
      { name: "平台外溢与算力再定价", driverBias: 14, constraintBias: -4, narration: "平台规则或模型发布改变产业分配，带来链条估值再定价。" },
      { name: "高景气延续但分化加大", driverBias: 10, constraintBias: 4, narration: "景气主线保留，但赢家与输家分化明显。" },
      { name: "落地不及预期", driverBias: -8, constraintBias: 12, narration: "交付或合规不及预期，估值回吐，主题热度下降。" }
    ],
    marketFocus: ["科技成长", "半导体", "电力设备", "美元利率", "产业安全"],
    visualFocus: ["技术扩散", "算力链", "规则调整"]
  }
];

const marketUniverse = [
  ...DOMESTIC_IMPACTS,
  ...A_SHARE_SECTORS,
  ...US_SECTORS,
  ...COMMODITY_BUCKETS,
  ...MACRO_BUCKETS
];

export const DEFAULT_THRESHOLDS = {
  modelEntryConfidence: 63,
  priorityAlert: 74,
  highRiskSeverity: 76,
  pricedInTrigger: 62
};

export const DEFAULT_SOURCE_RULES = {
  minConfirmations: 2,
  decayHalfLifeDays: 6,
  noisePenaltyByConflict: 8,
  officialBoost: 12
};

export const DEFAULT_MAPPING_TEMPLATE = marketUniverse.reduce<Record<string, number>>((acc, item) => {
  acc[item] = 0;
  return acc;
}, {});

export const FAMILY_MAPPING_MATRICES: Record<string, Record<string, number>> = {
  GEO_WAR: {
    ...DEFAULT_MAPPING_TEMPLATE,
    军工: 0.88,
    油气: 0.82,
    黄金: 0.76,
    有色: 0.22,
    航运: 0.64,
    航空: -0.7,
    消费: -0.46,
    新能源: -0.18,
    半导体: -0.14,
    电力设备: 0.1,
    化工: -0.24,
    汽车: -0.21,
    能源: 0.83,
    科技成长: -0.18,
    可选消费: -0.48,
    工业: -0.1,
    防御型资产: 0.56,
    利率敏感资产: -0.22,
    原油: 0.9,
    天然气: 0.72,
    铜: -0.08,
    航运运价: 0.7,
    "成品油/物流成本预期": 0.82,
    "消费情绪变化": -0.55,
    "舆论风险偏好": -0.78,
    "自主可控/产业安全预期": 0.56,
    "输入性通胀影响": 0.74,
    "美国利率预期": 0.22,
    "美元指数": 0.54,
    "人民币汇率": -0.26,
    "全球风险偏好": -0.82
  },
  TRADE_POLICY: {
    ...DEFAULT_MAPPING_TEMPLATE,
    军工: 0.08,
    油气: 0.14,
    黄金: 0.2,
    有色: -0.1,
    航运: 0.24,
    航空: -0.14,
    消费: -0.34,
    新能源: -0.76,
    半导体: -0.62,
    电力设备: -0.42,
    化工: -0.18,
    汽车: -0.68,
    能源: 0.1,
    科技成长: -0.26,
    可选消费: -0.4,
    工业: -0.24,
    防御型资产: 0.16,
    利率敏感资产: -0.14,
    原油: 0.14,
    天然气: 0.08,
    铜: -0.18,
    航运运价: 0.2,
    "成品油/物流成本预期": 0.2,
    "消费情绪变化": -0.44,
    "舆论风险偏好": -0.38,
    "自主可控/产业安全预期": 0.66,
    "输入性通胀影响": 0.58,
    "美国利率预期": 0.42,
    "美元指数": 0.24,
    "人民币汇率": -0.18,
    "全球风险偏好": -0.34
  },
  REGULATION_LAW: {
    ...DEFAULT_MAPPING_TEMPLATE,
    消费: -0.22,
    新能源: -0.1,
    半导体: -0.24,
    电力设备: -0.08,
    汽车: -0.16,
    科技成长: -0.66,
    可选消费: -0.36,
    工业: -0.12,
    防御型资产: 0.24,
    利率敏感资产: -0.1,
    黄金: 0.12,
    "消费情绪变化": -0.22,
    "舆论风险偏好": -0.34,
    "自主可控/产业安全预期": 0.3,
    "全球风险偏好": -0.26
  },
  CORPORATE_INDUSTRY: {
    ...DEFAULT_MAPPING_TEMPLATE,
    航空: -0.74,
    航运: 0.18,
    工业: -0.42,
    汽车: -0.3,
    化工: -0.16,
    可选消费: -0.12,
    能源: -0.08,
    "消费情绪变化": -0.12,
    "全球风险偏好": -0.18
  },
  SOCIAL_LABOR: {
    ...DEFAULT_MAPPING_TEMPLATE,
    航运: 0.56,
    航空: -0.34,
    消费: -0.28,
    化工: -0.12,
    汽车: -0.22,
    工业: -0.18,
    "成品油/物流成本预期": 0.34,
    "消费情绪变化": -0.3,
    "输入性通胀影响": 0.26,
    "全球风险偏好": -0.2,
    航运运价: 0.48
  },
  TECH_PLATFORM: {
    ...DEFAULT_MAPPING_TEMPLATE,
    半导体: 0.58,
    电力设备: 0.34,
    新能源: 0.12,
    科技成长: 0.78,
    工业: 0.16,
    防御型资产: -0.12,
    利率敏感资产: -0.26,
    "自主可控/产业安全预期": 0.48,
    "美国利率预期": 0.18,
    "全球风险偏好": 0.22
  }
};

export const DEFAULT_SOURCE_CONFIGS = [
  {
    id: "src-official-briefing",
    sourceName: "官方公告流",
    sourceType: "GOVERNMENT",
    sourceGrade: "S",
    enabled: true,
    refreshCron: "*/30 * * * *",
    latencyHint: "分钟级",
    weight: 1,
    ruleConfig: { confirmWeight: 1.2, duplicates: "merge-by-title" }
  },
  {
    id: "src-mainstream-media",
    sourceName: "主流媒体流",
    sourceType: "MEDIA",
    sourceGrade: "A",
    enabled: true,
    refreshCron: "*/15 * * * *",
    latencyHint: "分钟级",
    weight: 0.9,
    ruleConfig: { confirmWeight: 1, duplicates: "merge-by-headline-key" }
  },
  {
    id: "src-market-anomaly",
    sourceName: "市场异动流",
    sourceType: "EXCHANGE",
    sourceGrade: "A",
    enabled: true,
    refreshCron: "*/10 * * * *",
    latencyHint: "秒级",
    weight: 0.95,
    ruleConfig: { confirmWeight: 0.95, noiseCutoff: 58 }
  },
  {
    id: "src-corporate-disclosure",
    sourceName: "企业公告流",
    sourceType: "CORPORATE",
    sourceGrade: "A",
    enabled: true,
    refreshCron: "0 * * * *",
    latencyHint: "小时级",
    weight: 0.92,
    ruleConfig: { confirmWeight: 1.05 }
  },
  {
    id: "src-sellside-notes",
    sourceName: "研究跟踪流",
    sourceType: "SELL_SIDE",
    sourceGrade: "B",
    enabled: true,
    refreshCron: "0 */2 * * *",
    latencyHint: "小时级",
    weight: 0.74,
    ruleConfig: { confirmWeight: 0.7 }
  },
  {
    id: "src-physical-anomaly",
    sourceName: "物理世界异常接口",
    sourceType: "ALT_DATA",
    sourceGrade: "B",
    enabled: true,
    refreshCron: "*/20 * * * *",
    latencyHint: "分钟级",
    weight: 0.8,
    ruleConfig: { confirmWeight: 0.88 }
  }
] as const;

export function getFamilyConfig(familyType: string) {
  return FAMILY_CONFIGS.find((item) => item.familyType === familyType) ?? FAMILY_CONFIGS[0];
}
