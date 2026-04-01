import type { RawEventSample } from "@/lib/types";

export const rawEventSamples: RawEventSample[] = [
  {
    id: "evt-mideast-iran-2026",
    clusterId: "cluster-mideast-iran",
    title: "中东冲突升级：伊朗相关风险与红海航运扰动再定价",
    baseTitle: "中东战争 / 伊朗冲突升级",
    shortTitle: "中东冲突升级",
    summary:
      "围绕伊朗、以色列与代理人网络的多轮互动，使油运、黄金、军工与全球风险偏好持续处于再定价窗口，A股的油气、航运、军工受益，而航空、消费承压。",
    narrative:
      "事件并非单点军事新闻，而是安全困境、区域代理冲突、航运通道安全和能源风险溢价共同驱动的复合型地缘事件。",
    familyHints: ["地缘", "战争", "中东", "伊朗", "冲突"],
    subTypeHints: ["区域冲突升级"],
    tags: ["伊朗", "以色列", "红海", "能源", "军工", "航运"],
    regions: ["中东", "全球"],
    actors: [
      {
        name: "伊朗",
        actorType: "国家",
        region: "中东",
        role: "主行为体",
        objective: "提升威慑、维持地区影响力并通过代理网络抬高对手成本",
        leverageScore: 82,
        stance: "高压威慑",
        description: "通过直接或间接行动维持地区博弈筹码。"
      },
      {
        name: "以色列",
        actorType: "国家",
        region: "中东",
        role: "对手行为体",
        objective: "压制安全威胁、维持军事优势与国内政治稳定",
        leverageScore: 86,
        stance: "强硬回应",
        description: "对跨境威胁倾向于快速军事回应。"
      },
      {
        name: "美国",
        actorType: "国家",
        region: "全球",
        role: "外部约束方",
        objective: "控制外溢升级、保障航运和盟友安全",
        leverageScore: 88,
        stance: "有限介入",
        description: "在安全承诺与避免全面战争之间平衡。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-mideast-1",
        headline: "伊朗高级官员称将对地区袭击采取回应",
        summary: "官方表态提升威慑等级，市场担忧后续报复行动。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "S",
        sourceName: "官方公告流",
        publishTime: "2026-03-18T08:00:00.000Z",
        rawPayload: { sourceUrl: "demo://mideast/official-1", tone: "hawkish" }
      },
      {
        id: "sig-mideast-2",
        headline: "红海航运保费再度上行 航线绕行时间拉长",
        summary: "物理扰动与保险溢价同步走高，强化航运链条压力。",
        signalType: "PHYSICAL",
        sourceType: "ALT_DATA",
        sourceGrade: "B",
        sourceName: "物理世界异常接口",
        publishTime: "2026-03-19T03:00:00.000Z",
        rawPayload: { lane: "红海", insurancePremiumBps: 145 }
      },
      {
        id: "sig-mideast-3",
        headline: "布油与黄金同步走强 市场重计地缘风险溢价",
        summary: "原油和避险资产联动上涨，说明冲突并非单点噪音。",
        signalType: "MARKET",
        sourceType: "EXCHANGE",
        sourceGrade: "A",
        sourceName: "市场异动流",
        publishTime: "2026-03-19T13:00:00.000Z",
        rawPayload: { brent: "+2.7%", gold: "+1.4%" }
      },
      {
        id: "sig-mideast-4",
        headline: "多家主流媒体称美方要求盟友加强海运护航协调",
        summary: "外部约束方正在抬高遏制升级的防线。",
        signalType: "NEWS",
        sourceType: "MEDIA",
        sourceGrade: "A",
        sourceName: "主流媒体流",
        publishTime: "2026-03-20T10:00:00.000Z",
        rawPayload: { topic: "护航协调" }
      },
      {
        id: "sig-mideast-5",
        headline: "区域武装组织威胁扩大打击范围",
        summary: "代理人网络加入提升扩散与误判风险。",
        signalType: "SPEECH",
        sourceType: "MEDIA",
        sourceGrade: "B",
        sourceName: "主流媒体流",
        publishTime: "2026-03-21T09:30:00.000Z",
        rawPayload: { proxyNetwork: true }
      }
    ],
    startTime: "2024-04-14T00:00:00.000Z",
    latestUpdateTime: "2026-03-21T09:30:00.000Z",
    severityBase: 88,
    confidenceBase: 82,
    actualOutcome: {
      headline: "冲突保持高压但未滑向全面战争，能源与航运风险溢价阶段性抬升。",
      outcomePath: "有限对抗延续",
      marketOutcome: "原油、黄金和航运受益，全球消费与航空承压。",
      realizedEffects: ["布油与黄金先涨后高位震荡", "A股油气与军工获得交易性溢价", "航空与消费表现弱于大盘"]
    },
    keyDrivers: ["地区安全困境升级", "代理人网络持续活跃", "能源与航运通道脆弱性抬升"],
    keyConstraints: ["美国与盟友遏制全面升级", "伊朗与以色列均受国内外成本约束", "油价过快上行会引发更强干预"],
    keyTriggers: ["跨境打击或高官遇袭", "红海航线再度大规模受阻", "关键军事设施受损"],
    diffusionPaths: ["军事对抗 -> 航运绕行 -> 原油与物流成本抬升", "官方表态 -> 风险偏好下降 -> 防御资产走强", "代理冲突 -> 盟友介入预期 -> 军工主题强化"],
    marketTransmission: ["原油风险溢价", "黄金避险买盘", "航运保费上行", "航空成本承压", "A股军工油气估值扩张"]
  },
  {
    id: "evt-trade-war-2026",
    clusterId: "cluster-trade-war",
    title: "贸易战 / 关税战再升级：对华关税与产业链重组影响",
    baseTitle: "贸易战 / 关税升级",
    shortTitle: "关税升级",
    summary:
      "围绕电动车、半导体、储能与关键制造链的关税与限制措施，使通胀、产业替代、自主可控和全球供应链重估同步发生，市场进入“受益板块与受损板块并行”状态。",
    narrative:
      "该事件是政策冲突、产业补贴与大国竞争叠加下的长期变量，不仅影响进出口节奏，更影响资本开支、库存布局与利率预期。",
    familyHints: ["贸易", "关税", "政策", "供应链", "产业"],
    subTypeHints: ["关税升级"],
    tags: ["关税", "贸易战", "新能源", "半导体", "通胀", "产业链"],
    regions: ["中国", "美国", "全球"],
    actors: [
      {
        name: "美国贸易政策团队",
        actorType: "政策主体",
        region: "美国",
        role: "政策发起方",
        objective: "通过关税与限制重塑制造回流与谈判筹码",
        leverageScore: 84,
        stance: "鹰派推进",
        description: "以安全与就业叙事推动关税扩围。"
      },
      {
        name: "中国出口链企业",
        actorType: "产业主体",
        region: "中国",
        role: "承压与调整方",
        objective: "通过转口、出海和产品升级对冲冲击",
        leverageScore: 72,
        stance: "主动调整",
        description: "加快海外产能与供应链迁移。"
      },
      {
        name: "美国消费者与下游企业",
        actorType: "需求主体",
        region: "美国",
        role: "被传导方",
        objective: "平衡成本上升与替代供应",
        leverageScore: 64,
        stance: "成本敏感",
        description: "关税与通胀对终端需求形成约束。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-trade-1",
        headline: "美国宣布上调部分中国关键品类关税税率",
        summary: "电动车、锂电、半导体与关键零部件成为政策焦点。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "S",
        sourceName: "官方公告流",
        publishTime: "2026-03-12T13:00:00.000Z",
        rawPayload: { categories: ["EV", "Battery", "Semiconductor"] }
      },
      {
        id: "sig-trade-2",
        headline: "卖方跟踪：企业加速东南亚与墨西哥供应链布局",
        summary: "产业链迁移速度加快，但成本并未完全平滑。",
        signalType: "NEWS",
        sourceType: "SELL_SIDE",
        sourceGrade: "B",
        sourceName: "研究跟踪流",
        publishTime: "2026-03-13T06:00:00.000Z",
        rawPayload: { relocation: ["越南", "墨西哥"] }
      },
      {
        id: "sig-trade-3",
        headline: "美国通胀敏感品类价格预期抬升",
        summary: "市场开始重新评估输入性通胀与利率高位维持风险。",
        signalType: "MARKET",
        sourceType: "EXCHANGE",
        sourceGrade: "A",
        sourceName: "市场异动流",
        publishTime: "2026-03-13T20:00:00.000Z",
        rawPayload: { inflationSwap: "+7bp" }
      },
      {
        id: "sig-trade-4",
        headline: "国内政策表态支持自主可控与关键链补短板",
        summary: "政策对冲方向逐步清晰，自主可控和国产替代预期上行。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "A",
        sourceName: "官方公告流",
        publishTime: "2026-03-15T08:00:00.000Z",
        rawPayload: { support: ["半导体", "电力设备"] }
      },
      {
        id: "sig-trade-5",
        headline: "主流媒体称更多行业或纳入下一轮政策审查",
        summary: "说明冲突可能扩围，市场开始前置交易受损与受益名单。",
        signalType: "NEWS",
        sourceType: "MEDIA",
        sourceGrade: "A",
        sourceName: "主流媒体流",
        publishTime: "2026-03-18T10:00:00.000Z",
        rawPayload: { expandedReview: true }
      }
    ],
    startTime: "2024-05-14T00:00:00.000Z",
    latestUpdateTime: "2026-03-18T10:00:00.000Z",
    severityBase: 82,
    confidenceBase: 84,
    actualOutcome: {
      headline: "政策摩擦进入结构性常态化阶段，行业之间分化显著。",
      outcomePath: "结构性摩擦常态化",
      marketOutcome: "A股自主可控链受益，新能源整车与出口链承压，美股通胀敏感和半导体链承受分化。",
      realizedEffects: ["A股半导体设备和军工电子相对强势", "出口型新能源整车估值承压", "美国通胀预期边际抬升"]
    },
    keyDrivers: ["大国竞争与制造回流诉求", "选举周期下政策鹰派化", "关键产业链安全议题升温"],
    keyConstraints: ["美国终端通胀与消费者承压", "产业替代无法一蹴而就", "企业游说要求保留部分豁免"],
    keyTriggers: ["更多品类被纳入高关税", "出口管制同步升级", "中美高层对话缺乏实质缓和"],
    diffusionPaths: ["关税上调 -> 终端成本抬升 -> 通胀预期上行", "政策摩擦 -> 产业链迁移 -> 国产替代和出海逻辑重估", "审查扩围 -> 估值折价 -> 板块分化加大"],
    marketTransmission: ["A股自主可控与军工电子受益", "新能源整车与出口链受损", "美股半导体和可选消费分化", "美国利率预期抬升"]
  },
  {
    id: "evt-russia-ukraine-2026",
    clusterId: "cluster-russia-ukraine",
    title: "俄乌战争走势：长期消耗战、援助节奏与能源传导",
    baseTitle: "俄乌战争长期演化",
    shortTitle: "俄乌战争走势",
    summary:
      "俄乌战争已转化为长期消耗战，前线态势、外部援助、能源设施打击与谈判窗口共同决定未来 3 个月、半年和 1 年的路径概率，影响欧洲能源、全球风险偏好与军工链。",
    narrative:
      "该事件的本质是长期消耗与外部资源配置的博弈，不是单一胜负判断，因而需要多时间窗路径推演而非单点结论。",
    familyHints: ["战争", "俄乌", "地缘", "援助", "能源"],
    subTypeHints: ["长期消耗战"],
    tags: ["俄乌", "能源", "军工", "欧洲", "援助", "停火"],
    regions: ["欧洲", "俄罗斯", "乌克兰", "全球"],
    actors: [
      {
        name: "俄罗斯",
        actorType: "国家",
        region: "欧洲",
        role: "主行为体",
        objective: "维持战场主动权并提高乌方与西方长期成本",
        leverageScore: 84,
        stance: "持续施压",
        description: "通过打击能源与基础设施形成长期消耗。"
      },
      {
        name: "乌克兰",
        actorType: "国家",
        region: "欧洲",
        role: "对抗方",
        objective: "保持战线稳定并争取援助和谈判筹码",
        leverageScore: 76,
        stance: "依赖援助",
        description: "战场表现与外部援助节奏高度相关。"
      },
      {
        name: "北约 / 欧盟",
        actorType: "联盟",
        region: "欧洲",
        role: "外部支撑方",
        objective: "避免战线失衡并控制冲突外溢",
        leverageScore: 80,
        stance: "支持但克制",
        description: "援助力度与国内政治承受度之间存在张力。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-ru-1",
        headline: "乌方称关键能源设施再次遭遇打击",
        summary: "基础设施承压说明冲突仍在输出长期消耗逻辑。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "A",
        sourceName: "官方公告流",
        publishTime: "2026-03-16T06:00:00.000Z",
        rawPayload: { infra: "energy" }
      },
      {
        id: "sig-ru-2",
        headline: "欧洲新一轮援助计划获得推进",
        summary: "援助节奏影响战场稳定性与谈判窗口。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "A",
        sourceName: "官方公告流",
        publishTime: "2026-03-17T12:00:00.000Z",
        rawPayload: { aidPackage: true }
      },
      {
        id: "sig-ru-3",
        headline: "天然气与欧洲军工股同步走强",
        summary: "市场把冲突长期化纳入能源与军工风险溢价。",
        signalType: "MARKET",
        sourceType: "EXCHANGE",
        sourceGrade: "A",
        sourceName: "市场异动流",
        publishTime: "2026-03-18T19:00:00.000Z",
        rawPayload: { gas: "+3.1%", defenseBasket: "+2.4%" }
      },
      {
        id: "sig-ru-4",
        headline: "媒体称前线局部推进未改变总体拉锯格局",
        summary: "说明短期战术变化不足以改变长期判断。",
        signalType: "NEWS",
        sourceType: "MEDIA",
        sourceGrade: "A",
        sourceName: "主流媒体流",
        publishTime: "2026-03-20T08:00:00.000Z",
        rawPayload: { front: "stalemate" }
      },
      {
        id: "sig-ru-5",
        headline: "欧盟官员释放未来谈判窗口仍受限信号",
        summary: "谈判仍非主路径，长期消耗框架未变。",
        signalType: "SPEECH",
        sourceType: "GOVERNMENT",
        sourceGrade: "B",
        sourceName: "官方公告流",
        publishTime: "2026-03-21T16:00:00.000Z",
        rawPayload: { negotiationWindow: "limited" }
      }
    ],
    startTime: "2022-02-24T00:00:00.000Z",
    latestUpdateTime: "2026-03-21T16:00:00.000Z",
    severityBase: 86,
    confidenceBase: 85,
    actualOutcome: {
      headline: "长期消耗战框架未破，援助与能源扰动成为市场关注主线。",
      outcomePath: "有限对抗延续",
      marketOutcome: "欧洲军工与能源偏强，全球风险偏好与利率敏感资产承压。",
      realizedEffects: ["能源与防御资产相对占优", "科技成长风格受压制", "宏观层面风险偏好波动显著"]
    },
    keyDrivers: ["长期消耗战逻辑未改", "援助与补给节奏决定战线韧性", "能源设施打击强化跨市场传导"],
    keyConstraints: ["各方资源与财政承受度有限", "欧洲政治约束援助节奏", "全面失控会触发更高层级干预"],
    keyTriggers: ["前线关键区域失守", "能源基础设施大规模受损", "援助计划出现显著变化"],
    diffusionPaths: ["前线拉锯 -> 援助需求上升 -> 欧洲财政与军工订单强化", "能源设施打击 -> 天然气预期上行 -> 风险偏好承压", "长期战争 -> 利率敏感资产受损 -> 防御资产相对占优"],
    marketTransmission: ["欧洲能源与军工风险溢价", "A股黄金与军工边际受益", "全球风险偏好下降", "利率敏感资产承压"]
  },
  {
    id: "evt-regulation-dma-2026",
    clusterId: "cluster-regulation-dma",
    title: "欧盟平台监管升级：DMA/DSA 执法调查扩散",
    baseTitle: "平台监管执法升级",
    shortTitle: "平台监管升级",
    summary: "欧盟对大型平台的规则执法强化，重点影响科技成长估值、合规投入和广告/分发逻辑。",
    narrative: "规则边界明晰后，市场从单次处罚转向评估商业模式和利润率的长期重估。",
    familyHints: ["监管", "法律", "平台", "调查", "欧盟"],
    subTypeHints: ["平台监管调查"],
    tags: ["欧盟", "DMA", "平台", "科技成长", "广告", "应用分发"],
    regions: ["欧洲", "美国", "全球"],
    actors: [
      {
        name: "欧盟监管机构",
        actorType: "监管方",
        region: "欧洲",
        role: "执法主体",
        objective: "强化平台竞争与数据规则执行",
        leverageScore: 82,
        stance: "强监管",
        description: "对平台规则和接口开放进行持续执法。"
      },
      {
        name: "大型平台公司",
        actorType: "企业",
        region: "全球",
        role: "被监管主体",
        objective: "维持生态闭环与利润率",
        leverageScore: 76,
        stance: "合规对抗并存",
        description: "在合规与商业模式守卫之间寻求平衡。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-reg-1",
        headline: "欧盟就大型平台守门人规则启动新一轮审查",
        summary: "说明执法范围有外溢可能。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "S",
        sourceName: "官方公告流",
        publishTime: "2026-03-18T09:00:00.000Z",
        rawPayload: { regulation: "DMA" }
      },
      {
        id: "sig-reg-2",
        headline: "科技平台股开盘承压 市场担忧合规成本上升",
        summary: "估值端已开始体现规则冲击。",
        signalType: "MARKET",
        sourceType: "EXCHANGE",
        sourceGrade: "A",
        sourceName: "市场异动流",
        publishTime: "2026-03-18T15:00:00.000Z",
        rawPayload: { basket: "-1.8%" }
      }
    ],
    startTime: "2024-03-25T00:00:00.000Z",
    latestUpdateTime: "2026-03-18T15:00:00.000Z",
    severityBase: 68,
    confidenceBase: 78,
    actualOutcome: {
      headline: "监管延续高压但以执行细则为主，板块从普跌转向结构分化。",
      outcomePath: "规则落地后分化交易",
      marketOutcome: "大型平台承压，合规软件与防御资产相对占优。",
      realizedEffects: ["平台龙头估值受压", "防御属性提升", "纯粹题材热度下降"]
    },
    keyDrivers: ["竞争规则执行升级", "平台接口开放要求增强", "数据治理成为估值变量"],
    keyConstraints: ["执法周期长", "平台具备游说和技术缓冲空间"],
    keyTriggers: ["罚款决定公布", "新守门人名单扩容"],
    diffusionPaths: ["规则执行 -> 平台利润率下修 -> 科技成长承压"],
    marketTransmission: ["科技成长估值压缩", "防御型资产相对受益"]
  },
  {
    id: "evt-boeing-crisis-2026",
    clusterId: "cluster-boeing-crisis",
    title: "企业危机：波音质量事件与供应链恢复不及预期",
    baseTitle: "企业质量危机",
    shortTitle: "波音质量危机",
    summary: "波音质量事件与监管审查导致交付恢复放缓，航空制造链和航司运力安排面临扰动。",
    narrative: "这类事件的市场关键不在单一事故，而在产能恢复路径和替代受益名单。",
    familyHints: ["企业", "产业", "事故", "供应链"],
    subTypeHints: ["质量危机"],
    tags: ["波音", "航空", "交付", "制造业", "供应链"],
    regions: ["美国", "全球"],
    actors: [
      {
        name: "波音",
        actorType: "企业",
        region: "美国",
        role: "事件主体",
        objective: "稳定交付节奏并修复信任",
        leverageScore: 70,
        stance: "修复中",
        description: "需要同时面对监管、客户和供应链压力。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-boeing-1",
        headline: "监管方强调对航空制造质量问题持续加压",
        summary: "说明事件影响并未结束。",
        signalType: "OFFICIAL",
        sourceType: "GOVERNMENT",
        sourceGrade: "A",
        sourceName: "官方公告流",
        publishTime: "2026-03-17T12:00:00.000Z",
        rawPayload: { agency: "FAA" }
      },
      {
        id: "sig-boeing-2",
        headline: "供应链企业称交付恢复慢于原计划",
        summary: "修复斜率低于市场预期。",
        signalType: "NEWS",
        sourceType: "MEDIA",
        sourceGrade: "B",
        sourceName: "主流媒体流",
        publishTime: "2026-03-18T10:00:00.000Z",
        rawPayload: { delivery: "slow" }
      }
    ],
    startTime: "2024-01-06T00:00:00.000Z",
    latestUpdateTime: "2026-03-18T10:00:00.000Z",
    severityBase: 64,
    confidenceBase: 76,
    actualOutcome: {
      headline: "交付恢复斜率仍慢，航空制造链呈替代与修复并行。",
      outcomePath: "修复与替代并行",
      marketOutcome: "航空制造龙头承压，部分替代供应商受益。",
      realizedEffects: ["航司运力计划受扰动", "工业链分化明显"]
    },
    keyDrivers: ["质量事件削弱信任", "监管持续加压", "交付恢复慢于预期"],
    keyConstraints: ["长周期订单支撑", "行业双寡头格局限制替代速度"],
    keyTriggers: ["更多检查结果公布", "交付目标下修"],
    diffusionPaths: ["质量事件 -> 交付延后 -> 航司运力安排受影响"],
    marketTransmission: ["航空制造链承压", "工业替代链边际受益"]
  },
  {
    id: "evt-port-strike-2026",
    clusterId: "cluster-port-strike",
    title: "社会 / 劳工：美国港口谈判紧张与罢工风险",
    baseTitle: "港口罢工风险",
    shortTitle: "港口罢工风险",
    summary: "港口劳资谈判升温会通过物流、运价与库存周期传导至消费和工业品。",
    narrative: "社会劳工类事件的核心在于参与规模、谈判僵局和节点物流的重要性。",
    familyHints: ["社会", "劳工", "罢工", "港口", "物流"],
    subTypeHints: ["港口罢工"],
    tags: ["港口", "工会", "物流", "罢工", "航运"],
    regions: ["美国", "全球"],
    actors: [
      {
        name: "港口工会",
        actorType: "工会",
        region: "美国",
        role: "组织者",
        objective: "争取工资与自动化安排的更有利条件",
        leverageScore: 78,
        stance: "强硬谈判",
        description: "掌握关键物流节点话语权。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-port-1",
        headline: "港口劳资谈判进展缓慢 工会威胁升级行动",
        summary: "谈判僵局显著提升物流扰动概率。",
        signalType: "SPEECH",
        sourceType: "MEDIA",
        sourceGrade: "A",
        sourceName: "主流媒体流",
        publishTime: "2026-03-19T14:00:00.000Z",
        rawPayload: { strikeRisk: "high" }
      },
      {
        id: "sig-port-2",
        headline: "航运运价与保险报价边际上行",
        summary: "市场已提前对物流瓶颈进行试探性定价。",
        signalType: "MARKET",
        sourceType: "EXCHANGE",
        sourceGrade: "B",
        sourceName: "市场异动流",
        publishTime: "2026-03-20T07:00:00.000Z",
        rawPayload: { freight: "+4.2%" }
      }
    ],
    startTime: "2025-09-30T00:00:00.000Z",
    latestUpdateTime: "2026-03-20T07:00:00.000Z",
    severityBase: 62,
    confidenceBase: 72,
    actualOutcome: {
      headline: "局部扰动后回到谈判桌，未形成系统性停摆。",
      outcomePath: "局部扰动后谈判拉锯",
      marketOutcome: "运价短期走高，消费与工业链受轻度扰动。",
      realizedEffects: ["航运波动加大", "库存周期再平衡"]
    },
    keyDrivers: ["工资与自动化矛盾", "节点港口议价权高"],
    keyConstraints: ["政府干预与社会成本上升", "停工过久将伤害双方"],
    keyTriggers: ["谈判破裂", "关键港口停摆"],
    diffusionPaths: ["罢工威胁 -> 运价上行 -> 消费和库存周期扰动"],
    marketTransmission: ["航运受益", "消费与航空承压", "输入性通胀抬头"]
  },
  {
    id: "evt-ai-model-release-2026",
    clusterId: "cluster-ai-model",
    title: "科技 / 平台：大型模型发布引发算力链重估",
    baseTitle: "大型模型发布",
    shortTitle: "模型发布重估",
    summary: "新一代模型发布带来推理成本、算力需求和应用落地预期再定价，半导体、云与电力设备链条受益。",
    narrative: "科技平台事件的关键在于规则与技术扩散如何改变产业利润池分配。",
    familyHints: ["科技", "平台", "模型", "AI", "算力"],
    subTypeHints: ["模型发布"],
    tags: ["AI", "模型", "算力", "半导体", "云服务"],
    regions: ["美国", "中国", "全球"],
    actors: [
      {
        name: "大型AI平台",
        actorType: "平台",
        region: "全球",
        role: "发布方",
        objective: "扩大生态黏性并推动算力需求上行",
        leverageScore: 82,
        stance: "高投入扩张",
        description: "通过模型能力升级带动生态迁移。"
      }
    ],
    sourceInputs: [
      {
        id: "sig-ai-1",
        headline: "大型AI平台发布新一代多模态模型",
        summary: "模型能力上台阶，应用和推理需求预期抬升。",
        signalType: "OFFICIAL",
        sourceType: "CORPORATE",
        sourceGrade: "A",
        sourceName: "企业公告流",
        publishTime: "2026-03-19T17:00:00.000Z",
        rawPayload: { model: "multimodal" }
      },
      {
        id: "sig-ai-2",
        headline: "算力链与电力设备板块同步走强",
        summary: "市场开始交易资本开支与推理侧放量。",
        signalType: "MARKET",
        sourceType: "EXCHANGE",
        sourceGrade: "A",
        sourceName: "市场异动流",
        publishTime: "2026-03-20T02:00:00.000Z",
        rawPayload: { semis: "+3.5%", power: "+2.1%" }
      }
    ],
    startTime: "2026-03-19T00:00:00.000Z",
    latestUpdateTime: "2026-03-20T02:00:00.000Z",
    severityBase: 66,
    confidenceBase: 80,
    actualOutcome: {
      headline: "景气主线延续，但细分链条分化加大。",
      outcomePath: "高景气延续但分化加大",
      marketOutcome: "半导体与云链受益，纯题材链条分化。",
      realizedEffects: ["算力硬件龙头走强", "电力设备受益", "应用端估值分化"]
    },
    keyDrivers: ["模型能力跃迁", "资本开支扩张预期", "生态与开发者迁移"],
    keyConstraints: ["推理成本与货币化不确定", "监管与数据合规边界"],
    keyTriggers: ["企业客户签约放量", "推理成本显著下降"],
    diffusionPaths: ["模型发布 -> 算力需求上行 -> 半导体与电力设备受益"],
    marketTransmission: ["科技成长与半导体走强", "利率敏感资产承压"]
  }
];
