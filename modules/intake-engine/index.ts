import { createHash } from "node:crypto";

import type { FamilyType } from "@prisma/client";

import { classifyEvent } from "@/modules/classification-engine";
import type { ExternalDocument, SourceIntakeInput } from "@/modules/source-adapters";
import type { RawActorInput, RawEventSample, RawSignalInput } from "@/lib/types";

const REGION_KEYWORDS = [
  "中东",
  "欧洲",
  "美国",
  "中国",
  "全球",
  "俄罗斯",
  "乌克兰",
  "伊朗",
  "以色列",
  "欧盟",
  "亚洲",
  "middle east",
  "europe",
  "united states",
  "china",
  "global"
];

const TAG_CANDIDATES = [
  "伊朗",
  "以色列",
  "俄罗斯",
  "乌克兰",
  "关税",
  "贸易战",
  "供应链",
  "监管",
  "禁令",
  "反垄断",
  "AI",
  "模型",
  "平台",
  "数据泄露",
  "罢工",
  "工会",
  "航运",
  "原油",
  "黄金",
  "半导体",
  "新能源",
  "科技成长",
  "tariff",
  "trade",
  "sanction",
  "regulation",
  "antitrust",
  "platform",
  "ai",
  "strike",
  "shipping",
  "oil",
  "semiconductor"
];

const ACTOR_LIBRARY: Array<{ token: string; actorType: string; region: string; objective: string; stance: string }> = [
  { token: "伊朗", actorType: "国家", region: "中东", objective: "争取地区威慑与安全边界", stance: "强硬试探" },
  { token: "Iran", actorType: "国家", region: "中东", objective: "争取地区威慑与安全边界", stance: "强硬试探" },
  { token: "以色列", actorType: "国家", region: "中东", objective: "压制安全威胁并维持军事主动", stance: "快速回应" },
  { token: "Israel", actorType: "国家", region: "中东", objective: "压制安全威胁并维持军事主动", stance: "快速回应" },
  { token: "俄罗斯", actorType: "国家", region: "欧洲", objective: "维持前线主动权与战略纵深", stance: "持续施压" },
  { token: "Russia", actorType: "国家", region: "欧洲", objective: "维持前线主动权与战略纵深", stance: "持续施压" },
  { token: "乌克兰", actorType: "国家", region: "欧洲", objective: "争取援助并稳定战线", stance: "韧性防守" },
  { token: "Ukraine", actorType: "国家", region: "欧洲", objective: "争取援助并稳定战线", stance: "韧性防守" },
  { token: "美国", actorType: "国家", region: "全球", objective: "在增长、通胀与地缘目标间平衡", stance: "政策主导" },
  { token: "United States", actorType: "国家", region: "全球", objective: "在增长、通胀与地缘目标间平衡", stance: "政策主导" },
  { token: "欧盟", actorType: "政策主体", region: "欧洲", objective: "强化规则执行与统一市场秩序", stance: "规则推进" },
  { token: "European Union", actorType: "政策主体", region: "欧洲", objective: "强化规则执行与统一市场秩序", stance: "规则推进" },
  { token: "Meta", actorType: "平台企业", region: "全球", objective: "守住生态入口与商业化效率", stance: "审慎应对" },
  { token: "Apple", actorType: "平台企业", region: "全球", objective: "维持生态控制力与利润率", stance: "防守调整" },
  { token: "Google", actorType: "平台企业", region: "全球", objective: "维持流量入口与广告效率", stance: "合规应对" },
  { token: "波音", actorType: "企业", region: "美国", objective: "修复交付节奏与治理信任", stance: "修复推进" },
  { token: "Boeing", actorType: "企业", region: "美国", objective: "修复交付节奏与治理信任", stance: "修复推进" },
  { token: "工会", actorType: "劳工组织", region: "美国", objective: "争取工资与自动化安排优势", stance: "谈判施压" },
  { token: "union", actorType: "劳工组织", region: "美国", objective: "争取工资与自动化安排优势", stance: "谈判施压" }
];

const FAMILY_TEMPLATES: Record<
  FamilyType,
  {
    subType: string;
    drivers: string[];
    constraints: string[];
    triggers: string[];
    diffusion: string[];
    transmission: string[];
  }
> = {
  GEO_WAR: {
    subType: "实时地缘升级",
    drivers: ["安全困境与威慑升级", "冲突外溢风险走高", "航运与能源链条敏感度上升"],
    constraints: ["大国和盟友避免全面失控", "财政与物资约束抑制持续升级", "市场价格波动会反向约束政策动作"],
    triggers: ["关键设施受损", "高层表态显著转鹰", "物流或能源节点再度受阻"],
    diffusion: ["安全事件 -> 航运/能源再定价 -> 风险偏好下降", "冲突表态 -> 军工/避险资产走强 -> 成长资产受压"],
    transmission: ["原油与天然气风险溢价", "黄金避险买盘", "军工主题扩散", "航空与消费承压"]
  },
  TRADE_POLICY: {
    subType: "实时政策摩擦",
    drivers: ["政策冲突与产业博弈升温", "供应链重组和豁免博弈并行", "通胀与资本开支预期再平衡"],
    constraints: ["终端需求和通胀承压限制政策力度", "企业游说与替代速度不匹配", "高层对话仍可能释放缓和窗口"],
    triggers: ["新关税或限制清单发布", "关键行业被纳入审查", "贸易谈判表态明显恶化"],
    diffusion: ["政策加码 -> 成本抬升 -> 行业分化扩大", "出口受限 -> 国产替代/出海重估 -> 风格切换"],
    transmission: ["A股自主可控链受益", "出口链与可选消费承压", "美股半导体和工业链分化", "利率预期抬升"]
  },
  REGULATION_LAW: {
    subType: "实时监管调查",
    drivers: ["监管执行升级", "平台或行业规则边界收紧", "合规成本重新计价"],
    constraints: ["执法周期较长", "企业具备申诉与技术缓冲空间", "市场对长期风险已部分反映"],
    triggers: ["正式调查立案", "罚款或裁决公布", "守门人范围继续扩大"],
    diffusion: ["调查消息 -> 估值压缩 -> 生态与分发规则重估", "规则变化 -> 行业集中度变化 -> 风格切换"],
    transmission: ["科技成长承压", "合规与数据治理投入抬升", "部分替代平台受益"]
  },
  CORPORATE_INDUSTRY: {
    subType: "实时企业事件",
    drivers: ["治理或产能事件触发信任再评估", "供应链与交付节奏受影响", "行业替代逻辑升温"],
    constraints: ["订单积压与行业格局提供缓冲", "公司现金流与产能恢复仍有韧性", "市场已部分定价短期冲击"],
    triggers: ["监管披露或事故进展公布", "订单/交付指引下修", "关键供应商或客户反馈恶化"],
    diffusion: ["企业事件 -> 交付/成本变化 -> 产业链分化", "治理担忧 -> 估值折价 -> 替代者受益"],
    transmission: ["产业链龙头与替代链分化", "工业和汽车链条联动", "风险偏好对高贝塔板块有拖累"]
  },
  SOCIAL_LABOR: {
    subType: "实时劳工事件",
    drivers: ["谈判僵局与工资诉求抬升", "关键节点物流或产线受阻", "舆论和社会情绪推动议价"],
    constraints: ["政府和舆论施压避免长期停摆", "停工成本会反向约束参与方", "替代路径可能缓解局部冲击"],
    triggers: ["罢工升级", "关键港口或工厂停摆", "谈判破裂或示威扩大"],
    diffusion: ["劳工事件 -> 物流/库存扰动 -> 消费与工业链条承压", "运价上行 -> 输入性通胀预期抬升"],
    transmission: ["航运与部分物流链受益", "消费与航空受损", "风险偏好边际转弱"]
  },
  TECH_PLATFORM: {
    subType: "实时平台科技事件",
    drivers: ["模型、平台规则或数据问题引发估值重估", "算力与云资源需求变化", "生态入口和商业化逻辑重定价"],
    constraints: ["商业化兑现节奏仍有不确定", "监管与合规边界限制扩张速度", "市场对高景气已有一定预期"],
    triggers: ["模型发布/规则变化落地", "数据泄露或封禁升级", "资本开支或用户迁移数据超预期"],
    diffusion: ["平台/模型事件 -> 流量与算力分配变化 -> 产业链估值切换", "规则变化 -> 生态格局重排 -> 风格分化"],
    transmission: ["半导体与云链条受益或受损", "科技成长波动放大", "电力设备与应用层分化"]
  }
};

function uniq<T>(items: T[]) {
  return [...new Set(items)];
}

function hashValue(input: string) {
  return createHash("sha1").update(input).digest("hex").slice(0, 12);
}

function pickTags(text: string, query?: string) {
  const lower = text.toLowerCase();
  const matched = TAG_CANDIDATES.filter((tag) => lower.includes(tag.toLowerCase()));
  const queryTags = (query ?? "")
    .split(/[\s,/|]+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 2)
    .slice(0, 3);
  return uniq([...matched, ...queryTags, "实时接入"]).slice(0, 8);
}

function pickRegions(text: string) {
  const lower = text.toLowerCase();
  const matched = REGION_KEYWORDS.filter((keyword) => lower.includes(keyword.toLowerCase()));
  return uniq(matched.map((item) => (item === "middle east" ? "中东" : item === "europe" ? "欧洲" : item === "united states" ? "美国" : item === "china" ? "中国" : item === "global" ? "全球" : item))).slice(0, 4);
}

function buildActors(text: string, familyType: FamilyType, sourceName: string) {
  const matched = ACTOR_LIBRARY.filter((actor) => text.toLowerCase().includes(actor.token.toLowerCase())).slice(0, 3);

  if (!matched.length) {
    return [
      {
        name: sourceName,
        actorType: familyType === "REGULATION_LAW" ? "监管主体" : familyType === "TECH_PLATFORM" ? "平台主体" : "核心参与者",
        region: "全球",
        role: "主行为体",
        objective: "围绕当前事件争取议价、秩序或增长目标。",
        leverageScore: 72,
        stance: "持续观察",
        description: "由实时外部源抽取得到的首要参与方。"
      } satisfies RawActorInput
    ];
  }

  return matched.map((actor, index) => ({
    name: actor.token,
    actorType: actor.actorType,
    region: actor.region,
    role: index === 0 ? "主行为体" : "关键参与者",
    objective: actor.objective,
    leverageScore: 82 - index * 6,
    stance: actor.stance,
    description: "系统基于实时源标题、摘要和语义提示识别出的关键行为体。"
  }));
}

function toSignalInputs(documents: ExternalDocument[]) {
  return documents.map((document, index) => ({
    id: `sig-live-${hashValue(`${document.url}-${index}`)}`,
    headline: document.title,
    summary: document.summary,
    signalType: document.signalType,
    sourceType: document.sourceType,
    sourceGrade: document.sourceGrade,
    sourceName: document.sourceName,
    publishTime: document.publishedAt,
    rawPayload: {
      ...document.rawPayload,
      sourceUrl: document.url
    }
  })) satisfies RawSignalInput[];
}

function resolveTitle(documents: ExternalDocument[], query?: string) {
  if (query?.trim()) {
    const headline = documents[0]?.title ?? "";
    if (headline.toLowerCase().includes(query.trim().toLowerCase())) {
      return headline;
    }
    return `实时接入：${query.trim()} - ${headline || "外部源事件"}`;
  }

  return documents[0]?.title ?? "实时接入事件";
}

export function buildSampleFromExternalDocuments(input: SourceIntakeInput, documents: ExternalDocument[]): RawEventSample {
  const signalInputs = toSignalInputs(documents);
  const combinedText = [input.query ?? "", ...documents.map((item) => `${item.title} ${item.summary}`)].join(" ");
  const tags = pickTags(combinedText, input.query);
  const regions = pickRegions(combinedText);
  const latestUpdateTime = signalInputs
    .map((item) => new Date(item.publishTime).getTime())
    .sort((left, right) => right - left)[0];
  const earliestSignalTime = signalInputs
    .map((item) => new Date(item.publishTime).getTime())
    .sort((left, right) => left - right)[0];
  const title = resolveTitle(documents, input.query);
  const baseId = hashValue(`${input.preset}|${input.query ?? ""}|${input.sourceSite ?? ""}|${documents[0]?.url ?? title}`);

  const draftSample: RawEventSample = {
    id: `evt-live-${baseId}`,
    clusterId: `cluster-live-${baseId}`,
    title,
    baseTitle: input.query?.trim() || documents[0]?.sourceName || "实时源事件",
    shortTitle: input.query?.trim() || title.slice(0, 18),
    summary: documents.slice(0, 2).map((item) => item.summary).join(" ").slice(0, 180) || documents[0]?.title || "系统已从外部源抽取到新的事件线索。",
    narrative: `系统从 ${documents[0]?.sourceName ?? "外部源"} 抓取 ${documents.length} 条实时文档，并完成信号聚合、事件分类、路径预测与市场映射。`,
    familyHints: tags,
    subTypeHints: ["实时接入事件"],
    tags,
    regions: regions.length ? regions : ["全球"],
    actors: [],
    sourceInputs: signalInputs,
    startTime: new Date(earliestSignalTime || Date.now()).toISOString(),
    latestUpdateTime: new Date(latestUpdateTime || Date.now()).toISOString(),
    severityBase: Math.min(88, 58 + documents.length * 6 + (input.sourceSite ? 4 : 0)),
    confidenceBase: Math.min(86, 54 + documents.length * 5),
    actualOutcome: {
      headline: "实时接入案例已进入观察期，系统以后续信号对当前推演进行验证。",
      outcomePath: "实时观察基线",
      marketOutcome: "当前为实时预测样本，后续将以新增信号持续修正市场映射。",
      realizedEffects: ["已形成实时事件对象", "已完成分类、阶段识别与路径预测", "已生成市场映射与决策支持"]
    },
    keyDrivers: ["外部源密集提及的核心冲突正在升温"],
    keyConstraints: ["更多官方确认与后续数据仍会改变路径概率"],
    keyTriggers: ["新的官方、市场或物理异常信号进入模型"],
    diffusionPaths: ["外部源新信号 -> 聚合去重 -> 主事件排序变化"],
    marketTransmission: ["风险偏好与行业板块开始按主题重估"]
  };

  const detected = classifyEvent(draftSample);
  const familyTemplate = FAMILY_TEMPLATES[detected.familyType];
  const actors = buildActors(combinedText, detected.familyType, documents[0]?.sourceName ?? "外部源");

  return {
    ...draftSample,
    actors,
    subTypeHints: [familyTemplate.subType],
    keyDrivers: familyTemplate.drivers,
    keyConstraints: familyTemplate.constraints,
    keyTriggers: familyTemplate.triggers,
    diffusionPaths: familyTemplate.diffusion,
    marketTransmission: familyTemplate.transmission,
    summary:
      documents
        .slice(0, 2)
        .map((item) => item.summary || item.title)
        .join(" ")
        .slice(0, 220) || draftSample.summary,
    narrative: `${draftSample.narrative} 当前主判断更接近 ${detected.familyType} 家族，已自动套用对应子模型与市场映射规则。`
  };
}
