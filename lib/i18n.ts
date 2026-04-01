export const SUPPORTED_LOCALES = ["en-US", "zh-CN"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-US";
export const LOCALE_COOKIE_NAME = "hem-locale";

const FAMILY_LABELS = {
  "zh-CN": {
    GEO_WAR: "地缘 / 战争",
    TRADE_POLICY: "贸易 / 政策",
    REGULATION_LAW: "监管 / 法律",
    CORPORATE_INDUSTRY: "企业 / 产业",
    SOCIAL_LABOR: "社会 / 劳工",
    TECH_PLATFORM: "科技 / 平台"
  },
  "en-US": {
    GEO_WAR: "Geopolitics / War",
    TRADE_POLICY: "Trade / Policy",
    REGULATION_LAW: "Regulation / Law",
    CORPORATE_INDUSTRY: "Corporate / Industry",
    SOCIAL_LABOR: "Society / Labor",
    TECH_PLATFORM: "Technology / Platform"
  }
} as const;

const STAGE_LABELS = {
  "zh-CN": {
    LATENT: "潜伏期",
    HEATING: "升温期",
    TRIGGER: "触发期",
    DIFFUSION: "扩散期",
    CONFRONTATION: "对抗期",
    NEGOTIATION: "谈判期",
    REALIZATION: "兑现期",
    DECAY: "衰减期"
  },
  "en-US": {
    LATENT: "Latent",
    HEATING: "Heating",
    TRIGGER: "Trigger",
    DIFFUSION: "Diffusion",
    CONFRONTATION: "Confrontation",
    NEGOTIATION: "Negotiation",
    REALIZATION: "Realization",
    DECAY: "Decay"
  }
} as const;

const HORIZON_LABELS = {
  "zh-CN": {
    D7: "7天",
    D30: "30天",
    D90: "90天",
    D180: "180天",
    D365: "365天"
  },
  "en-US": {
    D7: "7D",
    D30: "30D",
    D90: "90D",
    D180: "180D",
    D365: "365D"
  }
} as const;

const MARKET_LABELS = {
  "zh-CN": {
    CN_SOCIETY: "国内社会",
    A_SHARE: "A股",
    US_EQUITY: "美股",
    COMMODITY: "商品",
    MACRO: "利率 / 汇率 / 风险偏好"
  },
  "en-US": {
    CN_SOCIETY: "China Society",
    A_SHARE: "A-Shares",
    US_EQUITY: "US Equities",
    COMMODITY: "Commodities",
    MACRO: "Rates / FX / Risk Appetite"
  }
} as const;

const SOURCE_GRADE_LABELS = {
  "zh-CN": {
    S: "S级",
    A: "A级",
    B: "B级",
    C: "C级"
  },
  "en-US": {
    S: "Grade S",
    A: "Grade A",
    B: "Grade B",
    C: "Grade C"
  }
} as const;

const DIRECTION_LABELS = {
  "zh-CN": {
    POSITIVE: "利多",
    NEGATIVE: "利空",
    NEUTRAL: "中性"
  },
  "en-US": {
    POSITIVE: "Bullish",
    NEGATIVE: "Bearish",
    NEUTRAL: "Neutral"
  }
} as const;

const NAV_ITEMS = {
  "zh-CN": [
    { href: "/", label: "全局态势台" },
    { href: "/markets", label: "资本市场作战台" },
    { href: "/backtests", label: "回测实验室" },
    { href: "/signals", label: "高频信号监控" },
    { href: "/models", label: "模型管理" },
    { href: "/settings", label: "系统设置" }
  ],
  "en-US": [
    { href: "/", label: "Global Overview" },
    { href: "/markets", label: "Market Desk" },
    { href: "/backtests", label: "Backtest Lab" },
    { href: "/signals", label: "Signal Monitor" },
    { href: "/models", label: "Model Center" },
    { href: "/settings", label: "Settings" }
  ]
} as const;

const dictionaries = {
  "zh-CN": {
    common: {
      yes: "是",
      no: "否",
      save: "保存",
      light: "浅色",
      dark: "深色",
      loading: "加载中",
      enabled: "已启用",
      disabled: "已停用",
      selected: "已选中候选事件：",
      analyzing: "已完成实时分析：",
      confidence: "置信度",
      severity: "严重度",
      notCalculated: "未计算",
      observing: "观察中",
      pendingConfirm: "待确认"
    },
    shell: {
      badge: "Human Event Matrix",
      description: "通用人类热点事件因果分析与资本市场影响决策系统",
      demoTitle: "默认演示模式已开启",
      demoDescription: "启动后即可直接查看 7 类事件样本，其中 3 个真实重点案例已在首页、详情、市场决策与回测实验室完整打通。",
      terminal: "HEM-CM Terminal",
      builtInLoop: "本地演示闭环已内置",
      realSources: "接入真实源"
    },
    theme: {
      toggleToLight: "浅色",
      toggleToDark: "深色"
    },
    search: {
      placeholder: "搜索事件、标签、摘要..."
    },
    home: {
      eyebrow: "全局态势台",
      title: "把热点事件变成可解释、可推演、可回测的资本市场决策链",
      description: "系统已内置中东冲突升级、贸易战/关税战、俄乌战争走势等真实案例，并将它们打通到因果链、路径预测、市场映射、高频信号与回测实验室；演示模式会按刷新频率滚动事件热度与信号节奏。",
      defaultChinese: "默认英文",
      englishAvailable: "支持中文切换",
      demoData: "完整演示数据",
      realCases: "3 起真实重点案例闭环",
      viewEvents: "查看热点事件",
      backtests: "进入回测实验室",
      metrics: {
        todayHotEvents: "今日热点事件数",
        highRiskCount: "高风险事件数",
        newHighImpactCount: "新增高影响事件数",
        globalRisk: "全局风险热度总分",
        todayHotEventsHint: "默认启动即展示聚合后的主事件对象，不是平铺新闻列表。",
        highRiskCountHint: "高风险由严重度、阶段、信号确认和扩散路径共同驱动。",
        newHighImpactCountHint: "默认突出对行业和宏观传导最明显的案例。",
        globalRiskHint: "用于快速判断市场是否进入事件驱动主导阶段。"
      },
      allFamilies: "全部家族"
    },
    dashboard: {
      eventRankTitle: "热点事件榜单",
      eventHeat: "事件热度",
      topPath: "主路径",
      waitingPath: "等待路径收敛",
      enterRoom: "进入作战室",
      riskHeatmapTitle: "家族风险热力图",
      eventCountSuffix: "起",
      impactOverviewTitle: "跨市场影响总览",
      positiveTrack: "受益主线",
      negativeTrack: "受损主线",
      noPositiveTrack: "暂无明显主线",
      noNegativeTrack: "暂无明显主线",
      signalStreamTitle: "实时信号流",
      entersModel: "已入模",
      observing: "观察中",
      linkedEvent: "关联事件："
    },
    markets: {
      eyebrow: "资本市场作战台",
      title: "把事件驱动拆成受益、受损、已定价与预期差",
      description: "这里突出事件驱动总分、市场已定价程度、预期差评分以及 A 股 / 美股 / 商品 / 风险规避的结构化排序。",
      eventDriveScore: "事件驱动总分",
      pricedIn: "市场已定价程度",
      expectationGap: "预期差评分",
      stageLabel: "阶段标签",
      crowdingWatch: "拥挤度观察",
      aSharePositive: "A股受益板块榜",
      aShareNegative: "A股受损板块榜",
      usPositive: "美股受益板块榜",
      usNegative: "美股受损板块榜",
      commodities: "商品机会榜",
      riskOff: "风险规避榜",
      transmission: "事件 -> 市场传导链图",
      summary: "事件摘要",
      searchExisting: "搜索已有事件",
      searchAndAnalyze: "搜索并分析新事件",
      queryPlaceholder: "输入事件名、关键词，或直接粘贴链接",
      sitePlaceholder: "指定数据源域名，可选",
      selectPrompt: "左侧按钮用于在系统已有事件中快速定位；右侧按钮会按关键词搜索真实公开源，或把你粘贴的链接直接接入并生成新的市场分析事件。",
      inputEvent: "请输入事件名称、关键词，或直接粘贴链接。",
      noMatch: "当前系统里还没有找到匹配事件，可以直接点右侧按钮接入真实源。",
      switchedTo: "已切换到：",
      inputTheme: "请输入事件主题，或直接粘贴真实数据源链接。",
      analyzeFailed: "接入真实源失败。"
    },
    backtests: {
      eyebrow: "回测实验室",
      title: "回放当时模型判断，看路径预测与真实落地的差距",
      description: "支持历史事件选择、时间轴回放、路径预测 vs 实际结果、市场映射对照、误差分析和模型版本差异。",
      missingData: "数据库尚未初始化回测数据，请先执行 Prisma 初始化与种子导入。",
      hitRate: "命中率",
      marketFit: "市场拟合度",
      replayWindow: "回放区间",
      summary: "结论总结",
      scoreChart: "分数变化曲线",
      comparisonTitle: "路径预测 vs 实际结果",
      probability: "概率",
      actualOutcome: "实际结果",
      outcomePath: "落地路径：",
      errorTitle: "误差分析与版本差异",
      strengths: "模型优势",
      misses: "误差来源"
    },
    signals: {
      eyebrow: "高频信号监控中心",
      title: "把新闻、官方公告、讲话、异动与异常接口放进同一条高频信号链",
      description: "系统对信源进行分级、做多源确认、去重、时效衰减和噪音控制；演示模式下会按系统刷新频率滚动信号时钟、置信度与主事件排序。",
      latestSignalStream: "最新信号流",
      aggregatedEvents: "聚合后的主事件",
      entersModel: "已进入主模型",
      pendingConfirm: "待确认",
      confidence: "置信度",
      confirmationStatus: "多源确认状态：",
      confirmationGroup: "组",
      confidenceTrend: "置信度变化：",
      entersMainModel: "是否进入主模型：",
      priorityAlert: "高优先级提醒：",
      liveIntakeTitle: "真实数据源接入与自动分析",
      intakeMode: "接入方式",
      searchTopic: "搜索主题",
      sourceSite: "指定数据源域名",
      pasteUrl: "粘贴链接",
      submit: "开始抓取并自动分析",
      systemWill: "系统会自动完成",
      step1: "1. 抓取外部文档并抽取标题、摘要、时间与信源信息",
      step2: "2. 自动去重聚合成主事件对象，识别事件家族与当前阶段",
      step3: "3. 生成因果链、路径概率、市场映射与决策支持",
      step4: "4. 结果直接写回现有系统，可进入事件作战室和资本市场作战台",
      analyzeDone: "已完成实时分析",
      signalsIngested: "已接入 ",
      signalSuffix: " 条实时信号，并写入正式事件链路。",
      enterEvent: "进入事件作战室",
      viewMarkets: "查看市场决策",
      placeholder: "当前支持按关键词搜索公开实时报道，或直接粘贴 RSS / Atom / JSON / 网页链接。分析完成后，事件会像内置案例一样进入系统主链路。",
      queryExample: "例如：俄乌 援助 能源 / AI 模型 发布 / 关税 半导体",
      siteExample: "例如：reuters.com / sec.gov / ec.europa.eu",
      urlExample: "支持 RSS / Atom / JSON 接口 / 网页链接"
    },
    events: {
      eyebrow: "事件作战室",
      overview: "事件总览卡",
      classification: "分类与阶段",
      drivers: "关键驱动因素",
      constraints: "约束因素",
      triggers: "关键触发",
      actors: "核心参与者面板",
      stance: "姿态：",
      transmission: "市场传导链与解释",
      signals: "高频信号与依据",
      validated: "已验证",
      pendingConfirm: "待确认",
      causalChain: "因果链可视化",
      pathPanel: "路径概率区",
      conditions: "成立条件",
      invalidationSignals: "失效信号",
      impactGrid: "市场影响映射",
      strength: "强度",
      pricedIn: "已定价",
      crowding: "拥挤度",
      actionWatch: "加入关注",
      actionAlert: "预警按钮",
      actionExport: "导出分析",
      exportDone: "分析包已导出。",
      watchDone: "已加入关注列表，并进入默认观察组。",
      alertDone: "预警规则已创建，后续信号进入高优先级提醒。",
      unknownAction: "未识别的操作"
    },
    models: {
      eyebrow: "模型管理页",
      title: "母模型、六类子模型、信源规则和阈值都可以直观看到",
      description: "这里展示子模型列表、权重配置、变量解释、市场映射矩阵、路径模板、信源规则与版本记录，并支持恢复默认和导入导出。",
      sourceRules: "信源规则配置",
      refreshRate: "刷新频率：",
      latencyHint: "延迟提示：",
      variables: "变量解释",
      visualFocus: "展示重点",
      versionInfo: "版本信息",
      version: "版本 ",
      active: "当前启用",
      standby: "备用版本",
      enable: "启用",
      save: "保存",
      updated: "模型配置已更新。"
    },
    settings: {
      eyebrow: "系统设置页",
      title: "数据源、语言、主题、刷新频率与演示模式都能在本地直接管理",
      description: "默认英文，支持中文切换、浅色/深色模式、默认市场偏好、演示数据开关和导出设置。",
      systemSettings: "系统设置",
      dataSources: "数据源设置",
      language: "语言设置",
      chinese: "中文",
      english: "English",
      theme: "主题设置",
      followSystem: "跟随系统",
      refreshMinutes: "刷新频率（分钟）",
      export: "导出设置",
      demoMode: "演示数据开关",
      demoDescription: "开启后会保留真实案例样本，同时按刷新频率滚动信号发布时间、置信度和主事件排序；关闭后显示原始基线样本。",
      preferredMarkets: "默认市场偏好（逗号分隔）",
      save: "保存设置",
      enabled: "已启用",
      disabled: "已停用",
      refresh: "刷新：",
      latency: "延迟提示：",
      saved: "系统设置已保存。"
    },
    feedback: {
      errorTitle: "页面加载出现波动",
      errorDescription: "系统已保留当前工程与数据，通常重新拉起页面即可恢复。若数据库尚未初始化，请先执行 README 中的 Prisma 初始化步骤。",
      reload: "重新加载",
      notFoundTitle: "没有找到对应事件",
      notFoundDescription: "这通常意味着事件 ID 不存在，或数据库尚未初始化。你可以返回首页查看内置真实案例。",
      backHome: "返回首页"
    }
  },
  "en-US": {
    common: {
      yes: "Yes",
      no: "No",
      save: "Save",
      light: "Light",
      dark: "Dark",
      loading: "Loading",
      enabled: "Enabled",
      disabled: "Disabled",
      selected: "Selected candidate event: ",
      analyzing: "Live analysis completed: ",
      confidence: "Confidence",
      severity: "Severity",
      notCalculated: "Not calculated",
      observing: "Observing",
      pendingConfirm: "Pending confirmation"
    },
    shell: {
      badge: "Human Event Matrix",
      description: "A general causal analysis and capital-market decision system for human-driven hotspot events",
      demoTitle: "Demo mode is enabled by default",
      demoDescription: "You can inspect seven event sample groups immediately after launch, and three real-world flagship cases are already connected across the dashboard, detail view, market desk, and backtest lab.",
      terminal: "HEM-CM Terminal",
      builtInLoop: "Built-in local demo loop",
      realSources: "Connect Live Sources"
    },
    theme: {
      toggleToLight: "Light",
      toggleToDark: "Dark"
    },
    search: {
      placeholder: "Search events, tags, or summaries..."
    },
    home: {
      eyebrow: "Global Overview",
      title: "Turn hot events into explainable, simulated, and backtestable market decision chains",
      description: "The system ships with real cases such as Middle East conflict escalation, tariff and trade war scenarios, and the Russia-Ukraine war trajectory, all connected to causal chains, path forecasts, market mapping, signal monitoring, and backtests.",
      defaultChinese: "English by default",
      englishAvailable: "Chinese switch enabled",
      demoData: "Complete demo dataset",
      realCases: "3 flagship real-case loops",
      viewEvents: "View Hot Events",
      backtests: "Open Backtest Lab",
      metrics: {
        todayHotEvents: "Today's Hot Events",
        highRiskCount: "High-Risk Events",
        newHighImpactCount: "New High-Impact Events",
        globalRisk: "Global Risk Score",
        todayHotEventsHint: "The default launch shows aggregated primary events instead of a flat news feed.",
        highRiskCountHint: "High risk is driven by severity, stage, signal confirmation, and diffusion paths together.",
        newHighImpactCountHint: "The default view highlights cases with the clearest industry and macro transmission.",
        globalRiskHint: "Use it to judge whether markets are entering an event-driven phase."
      },
      allFamilies: "All Families"
    },
    dashboard: {
      eventRankTitle: "Hot Event Ranking",
      eventHeat: "Event Heat",
      topPath: "Top Path",
      waitingPath: "Awaiting path convergence",
      enterRoom: "Open War Room",
      riskHeatmapTitle: "Family Risk Heatmap",
      eventCountSuffix: " events",
      impactOverviewTitle: "Cross-Market Impact Overview",
      positiveTrack: "Positive theme",
      negativeTrack: "Negative theme",
      noPositiveTrack: "No dominant theme yet",
      noNegativeTrack: "No dominant theme yet",
      signalStreamTitle: "Live Signal Stream",
      entersModel: "In Model",
      observing: "Observing",
      linkedEvent: "Linked event: "
    },
    markets: {
      eyebrow: "Market Desk",
      title: "Break event-driven moves into winners, losers, priced-in moves, and expectation gaps",
      description: "This view emphasizes event-drive score, priced-in level, expectation gap, and structured rankings across A-shares, US equities, commodities, and risk-off assets.",
      eventDriveScore: "Event Drive Score",
      pricedIn: "Priced-In Level",
      expectationGap: "Expectation Gap",
      stageLabel: "Stage",
      crowdingWatch: "Crowding Watch",
      aSharePositive: "A-Share Winners",
      aShareNegative: "A-Share Losers",
      usPositive: "US Winners",
      usNegative: "US Losers",
      commodities: "Commodity Opportunities",
      riskOff: "Risk-Off Ranking",
      transmission: "Event -> Market Transmission",
      summary: "Event Summary",
      searchExisting: "Find Existing Event",
      searchAndAnalyze: "Search & Analyze",
      queryPlaceholder: "Enter an event, keyword, or paste a link",
      sitePlaceholder: "Optional source domain",
      selectPrompt: "Use the left button to locate an existing event, or use the right button to search public live sources or analyze the pasted link as a new market event.",
      inputEvent: "Enter an event name, keyword, or paste a link.",
      noMatch: "No matching event is in the system yet. You can use the button on the right to analyze a live source.",
      switchedTo: "Switched to: ",
      inputTheme: "Enter an event topic or paste a live source URL.",
      analyzeFailed: "Failed to analyze the live source."
    },
    backtests: {
      eyebrow: "Backtest Lab",
      title: "Replay historical model decisions and compare forecasts with realized outcomes",
      description: "Supports historical event selection, timeline playback, forecast vs actual comparison, market mapping review, error analysis, and model-version differences.",
      missingData: "Backtest data has not been initialized yet. Run the Prisma initialization and seed import first.",
      hitRate: "Hit Rate",
      marketFit: "Market Fit",
      replayWindow: "Replay Window",
      summary: "Summary",
      scoreChart: "Score Playback",
      comparisonTitle: "Forecast vs Actual",
      probability: "Probability",
      actualOutcome: "Actual Outcome",
      outcomePath: "Realized path: ",
      errorTitle: "Error Analysis & Version Delta",
      strengths: "Model Strengths",
      misses: "Error Sources"
    },
    signals: {
      eyebrow: "Signal Monitor",
      title: "Put news, official statements, speeches, anomalies, and data endpoints into one high-frequency signal chain",
      description: "The system grades sources, performs multi-source confirmation, deduplicates signals, applies time decay, and controls noise while the demo mode refreshes timing and confidence rhythm.",
      latestSignalStream: "Latest Signal Stream",
      aggregatedEvents: "Aggregated Primary Events",
      entersModel: "Entered Main Model",
      pendingConfirm: "Pending confirmation",
      confidence: "Confidence",
      confirmationStatus: "Multi-source confirmation: ",
      confirmationGroup: " groups",
      confidenceTrend: "Confidence trend: ",
      entersMainModel: "Entered main model: ",
      priorityAlert: "Priority alert: ",
      liveIntakeTitle: "Live Source Intake & Auto Analysis",
      intakeMode: "Intake Mode",
      searchTopic: "Search Topic",
      sourceSite: "Source Domain",
      pasteUrl: "Paste URL",
      submit: "Fetch and Analyze",
      systemWill: "The system will automatically",
      step1: "1. Fetch external documents and extract headlines, summaries, timestamps, and source metadata",
      step2: "2. Deduplicate and aggregate them into a primary event, then identify family and stage",
      step3: "3. Generate causal chains, path probabilities, market mapping, and decision support",
      step4: "4. Write results back into the existing system so they can open in the war room and market desk",
      analyzeDone: "Live analysis completed",
      signalsIngested: "Ingested ",
      signalSuffix: " live signals into the formal event chain.",
      enterEvent: "Open War Room",
      viewMarkets: "View Market Desk",
      placeholder: "You can search public live reports by keyword or paste RSS / Atom / JSON / webpage links. Once analyzed, the event enters the same core workflow as built-in cases.",
      queryExample: "For example: Ukraine aid energy / AI model launch / tariff semiconductor",
      siteExample: "For example: reuters.com / sec.gov / ec.europa.eu",
      urlExample: "Supports RSS / Atom / JSON API / webpage links"
    },
    events: {
      eyebrow: "Event War Room",
      overview: "Event Overview",
      classification: "Classification & Stage",
      drivers: "Key Drivers",
      constraints: "Constraints",
      triggers: "Key Triggers",
      actors: "Core Actors",
      stance: "Stance: ",
      transmission: "Market Transmission & Rationale",
      signals: "Signals & Evidence",
      validated: "Validated",
      pendingConfirm: "Pending confirmation",
      causalChain: "Causal Chain",
      pathPanel: "Path Probability Panel",
      conditions: "Conditions",
      invalidationSignals: "Invalidation Signals",
      impactGrid: "Market Impact Mapping",
      strength: "Strength",
      pricedIn: "Priced in",
      crowding: "Crowding",
      actionWatch: "Add to Watchlist",
      actionAlert: "Create Alert",
      actionExport: "Export Analysis",
      exportDone: "Analysis package exported.",
      watchDone: "Added to the watchlist and assigned to the default watch group.",
      alertDone: "Alert rule created. Future signals now enter the high-priority queue.",
      unknownAction: "Unknown action"
    },
    models: {
      eyebrow: "Model Center",
      title: "Inspect the parent model, six sub-models, source rules, and thresholds in one place",
      description: "This page shows sub-model lists, weights, variable explanations, market mapping matrices, path templates, source rules, and version history, and supports restore and import/export workflows.",
      sourceRules: "Source Rule Configuration",
      refreshRate: "Refresh: ",
      latencyHint: "Latency hint: ",
      variables: "Variables",
      visualFocus: "Visual Focus",
      versionInfo: "Version",
      version: "Version ",
      active: "Active",
      standby: "Standby",
      enable: "Enable",
      save: "Save",
      updated: "Model configuration updated."
    },
    settings: {
      eyebrow: "Settings",
      title: "Manage sources, language, theme, refresh cadence, and demo mode locally",
      description: "English is the default language, with a Chinese switch, plus light/dark modes, preferred markets, demo toggles, and export settings.",
      systemSettings: "System Settings",
      dataSources: "Data Sources",
      language: "Language",
      chinese: "中文",
      english: "English",
      theme: "Theme",
      followSystem: "Follow system",
      refreshMinutes: "Refresh Interval (min)",
      export: "Export Format",
      demoMode: "Demo Data Toggle",
      demoDescription: "When enabled, the system keeps real-case samples and rolls signal times, confidence, and event ranking by refresh cadence; when disabled, it shows the original baseline samples.",
      preferredMarkets: "Preferred Markets (comma separated)",
      save: "Save Settings",
      enabled: "Enabled",
      disabled: "Disabled",
      refresh: "Refresh: ",
      latency: "Latency hint: ",
      saved: "System settings saved."
    },
    feedback: {
      errorTitle: "The page encountered a loading issue",
      errorDescription: "The system has preserved the current workspace and data. Reloading the page usually resolves it. If the database is not initialized yet, follow the Prisma initialization steps in the README first.",
      reload: "Reload",
      notFoundTitle: "Event not found",
      notFoundDescription: "This usually means the event ID does not exist or the database has not been initialized. You can return to the home page to browse built-in real cases.",
      backHome: "Back Home"
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function normalizeLocale(locale?: string | null): Locale {
  if (!locale) return DEFAULT_LOCALE;
  return SUPPORTED_LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function getFamilyLabels(locale: Locale) {
  return FAMILY_LABELS[locale];
}

export function getStageLabels(locale: Locale) {
  return STAGE_LABELS[locale];
}

export function getHorizonLabels(locale: Locale) {
  return HORIZON_LABELS[locale];
}

export function getMarketLabels(locale: Locale) {
  return MARKET_LABELS[locale];
}

export function getSourceGradeLabels(locale: Locale) {
  return SOURCE_GRADE_LABELS[locale];
}

export function getDirectionLabels(locale: Locale) {
  return DIRECTION_LABELS[locale];
}

export function getNavItems(locale: Locale) {
  return NAV_ITEMS[locale];
}

export function translateStageLabel(stageOrLabel: string, locale: Locale) {
  const stageLabels = STAGE_LABELS[locale];
  if (stageOrLabel in stageLabels) {
    return stageLabels[stageOrLabel as keyof typeof stageLabels];
  }

  const matched = Object.entries(STAGE_LABELS["zh-CN"]).find(([, label]) => label === stageOrLabel);
  return matched ? stageLabels[matched[0] as keyof typeof stageLabels] : stageOrLabel;
}

export function formatDateTime(value: Date | string | number, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleString(locale, options);
}

export function formatDate(value: Date | string | number, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString(locale, options);
}
