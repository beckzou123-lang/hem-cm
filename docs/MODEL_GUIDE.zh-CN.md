# HEM-CM 模型指南

这份文档说明 HEM-CM 的模型层是如何组织的、哪些部分可以被调优，以及贡献者应该如何在不破坏可解释性的前提下扩展模型行为。

## 模型理念

HEM-CM 并不是一个黑盒预测系统。

它的建模方式强调：

- 结构化
- 可解释
- 家族感知
- 多时间窗
- 市场联动

仓库把一个事件建模成可复用的推理对象，而不是简单的“标题 + 分数”。

## 模型栈

建模层分为两级：

### 1. 因果母模型

母模型负责表达跨事件家族共享的推理原语，包括：

- 行为体
- 行为体目标
- 激励强度
- 约束强度
- 触发条件
- 响应弹性
- 扩散路径
- 市场传导中介变量

这是系统的统一推理语法，使不同事件类型之间仍然可比较。

### 2. 家族子模型

在母模型之上，HEM-CM 目前定义了六类可配置事件家族：

- `GEO_WAR`
- `TRADE_POLICY`
- `REGULATION_LAW`
- `CORPORATE_INDUSTRY`
- `SOCIAL_LABOR`
- `TECH_PLATFORM`

每个家族都会带入自己的：

- 变量集合
- 权重逻辑
- 阶段偏置
- 路径模板
- 市场关注点
- 可视化关注点
- 映射行为

这也是为什么系统能持续扩展，而不会沦为一堆互不相关的启发式规则。

## 模型逻辑位于哪里

当前与模型直接相关的主要源码包括：

- `modules/config-engine/default-config.ts`
- `modules/event-engine/index.ts`
- `modules/classification-engine/`
- `modules/stage-engine/`
- `modules/signal-engine/`
- `modules/causal-engine/`
- `modules/prediction-engine/`
- `modules/market-engine/`
- `modules/backtest-engine/`
- `modules/seed-engine/index.ts`

模型配置相关的持久化结构则在 `prisma/schema.prisma` 中，通过 `ModelConfig` 及相关输出表保存。

## 事件包建模流程

整个建模流水线由 `buildEventBundle()` 编排。

对于每个原始事件样本，系统会依次完成：

1. 识别事件家族
2. 识别当前阶段
3. 聚合信号质量与确认强度
4. 构建因果母模型
5. 构建因果链
6. 计算 severity 与 confidence
7. 生成多时间窗路径预测
8. 生成市场与行业映射
9. 在需要时生成 replay / backtest 对象

也就是说，最终事件对象里既包含推理状态，也包含下游市场解释。

## 可配置模型面

最重要的可调面集中在 `default-config.ts`。

### 家族变量

每个家族都会声明自己的变量集，用来表达该模型“在意什么”。

例如：

- 军事升级强度
- 关税强度
- 监管范围
- 治理可信度
- 物流扰动
- 平台规则变化

这些变量并不是装饰字段，它们会影响贡献者如何理解和扩展这个家族。

### 权重

每个家族配置中都包含一个 `weights` 对象，用来控制不同因素在最终打分中的权重。

常见维度包括：

- severity
- confidence
- incentive
- constraint
- signal confirmation
- market transmission
- stage

### 阶段偏置

每个家族还有一个按事件阶段分布的 `stageBias`。

这使得同一个事件会因为处在 latent、heating、trigger、diffusion、negotiation、realization 或 decay 等不同阶段，而被赋予不同的风险权重。

### 路径模板

每个家族都提供路径模板，包含：

- 路径名称
- driver bias
- constraint bias
- narration

这些模板是系统生成多时间窗情景路径的基础素材。

### 映射矩阵

市场层会使用家族级 mapping matrix，把同一事件翻译成下游市场反应。

这让 HEM-CM 不只是“给事件贴标签”，而是进一步回答：

- 哪些板块受益，哪些受损
- 市场是否已经定价
- 跨市场如何传导
- 风险偏好如何变化

### 阈值与信源规则

全局 thresholds 与 source rules 会影响模型准入与置信行为。

当前重要默认值包括：

- 模型进入阈值
- 优先级预警阈值
- 高风险 severity 阈值
- priced-in 阈值
- 最小确认数
- 信号衰减半衰期
- 冲突噪音惩罚
- 官方信源加权

这些值直接决定了一个信源包会被视为高价值事件候选，还是只是噪音样本。

## 当前产品中可编辑的模型面

目前 Model Center 暴露的是一套有边界的编辑能力。

当前可以通过产品修改的主要内容有：

- version
- description
- active 状态
- 部分 threshold

这个界面刻意没有暴露全部 config-engine 细节。更深层的模型设计仍然被视为仓库级修改，而不是随意在 UI 里即时调参。

## 持久化模型

建模层会把结构化输出拆开持久化：

- `Event` 保存规范化事件状态
- `PathPrediction` 保存路径预测
- `MarketImpact` 保存市场输出
- `SectorImpact` 保存行业分解
- `BacktestRun` 保存回放与验证结果
- `ModelConfig` 保存可编辑模型配置

这种拆分很重要，因为每种模型产物回答的问题都不同：

- 现在发生了什么
- 为什么重要
- 接下来可能走哪条路径
- 市场可能如何反应
- 历史上模型表现如何

## Seed 模型数据

仓库在 seed 阶段不仅会生成事件包，也会生成模型配置记录。

当前 seed 层会创建：

- 一个全局母模型配置
- 六个家族子模型配置
- 默认信源配置
- 默认 threshold 与 source rules

这使得产品在初始化后立即可被查看，也给贡献者提供了稳定的实验基线。

## 如何安全扩展模型行为

修改模型时建议遵循这个顺序：

1. 先明确修改属于 classification、stage、signal、path 还是 market mapping
2. 尽量只改动最窄的一层
3. 保持推理显式，不要把逻辑藏进一次性分数修补
4. 优先改 config-first 的结构，而不是新增硬编码特例
5. 至少验证 seed case 与一个 live-intake 风格案例

目标不只是“输出更好看”，而是“输出更好，同时仍然能被调试和审查”。

## 高价值贡献方向

当前最值得投入的模型贡献包括：

- 更清晰的家族变量
- 更稳健的阶段启发式
- 更强的失效信号逻辑
- 更丰富的路径 narration
- 更真实的市场映射矩阵
- 更好的 replay 指标
- 更强的 benchmark 事件集

## 验证清单

修改模型后，至少应验证：

- 五个时间窗的预测仍能生成
- 概率分布仍然合理
- 因果链结构仍然被正确填充
- 市场映射仍覆盖预期输出面
- replay / backtest 行为仍然正常
- `npm run build` 通过
- `npm run validate` 通过

如果改动影响了 UI 可编辑的模型记录，还应额外确认 Model Center 仍然能正常加载和保存。

## 总结

HEM-CM 把建模视为一套分层推理系统：

- 母模型负责可复用因果语法
- 家族模型负责领域专化
- 预测层负责情景结构
- 市场映射层负责可投资翻译
- replay 层负责验证

正是这种分层设计，让仓库既能继续演进出更强的智能能力，又能保持足够透明，适合开源协作。
