export const APP_NAME = "HEM-CM";

export const FAMILY_LABELS = {
  GEO_WAR: "地缘 / 战争",
  TRADE_POLICY: "贸易 / 政策",
  REGULATION_LAW: "监管 / 法律",
  CORPORATE_INDUSTRY: "企业 / 产业",
  SOCIAL_LABOR: "社会 / 劳工",
  TECH_PLATFORM: "科技 / 平台"
} as const;

export const STAGE_LABELS = {
  LATENT: "潜伏期",
  HEATING: "升温期",
  TRIGGER: "触发期",
  DIFFUSION: "扩散期",
  CONFRONTATION: "对抗期",
  NEGOTIATION: "谈判期",
  REALIZATION: "兑现期",
  DECAY: "衰减期"
} as const;

export const HORIZON_LABELS = {
  D7: "7天",
  D30: "30天",
  D90: "90天",
  D180: "180天",
  D365: "365天"
} as const;

export const MARKET_LABELS = {
  CN_SOCIETY: "国内社会",
  A_SHARE: "A股",
  US_EQUITY: "美股",
  COMMODITY: "商品",
  MACRO: "利率 / 汇率 / 风险偏好"
} as const;

export const SOURCE_GRADE_LABELS = {
  S: "S级",
  A: "A级",
  B: "B级",
  C: "C级"
} as const;

export const DIRECTION_LABELS = {
  POSITIVE: "利多",
  NEGATIVE: "利空",
  NEUTRAL: "中性"
} as const;

export const A_SHARE_SECTORS = [
  "军工",
  "油气",
  "黄金",
  "有色",
  "航运",
  "航空",
  "消费",
  "新能源",
  "半导体",
  "电力设备",
  "化工",
  "汽车"
] as const;

export const US_SECTORS = [
  "能源",
  "军工",
  "科技成长",
  "半导体",
  "可选消费",
  "航空",
  "工业",
  "防御型资产",
  "利率敏感资产"
] as const;

export const DOMESTIC_IMPACTS = [
  "成品油/物流成本预期",
  "消费情绪变化",
  "舆论风险偏好",
  "自主可控/产业安全预期",
  "输入性通胀影响"
] as const;

export const COMMODITY_BUCKETS = ["原油", "黄金", "天然气", "铜", "航运运价"] as const;
export const MACRO_BUCKETS = ["美国利率预期", "美元指数", "人民币汇率", "全球风险偏好"] as const;

export const NAV_ITEMS = [
  { href: "/", label: "全局态势台" },
  { href: "/markets", label: "资本市场作战台" },
  { href: "/backtests", label: "回测实验室" },
  { href: "/signals", label: "高频信号监控" },
  { href: "/models", label: "模型管理" },
  { href: "/settings", label: "系统设置" }
];
