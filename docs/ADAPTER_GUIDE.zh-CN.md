# HEM-CM Adapter 指南

这份文档说明 HEM-CM 中 live-source adapter 的工作方式、必须产出的数据结构，以及如何在不破坏安全性和可解释性的前提下扩展接入链路。

## 为什么 adapter 很重要

Adapter 是外部信息世界与内部事件引擎之间的桥梁。

它负责把异构信源输入转换成标准化文档，使系统能够：

- 分类
- 聚合
- 打分
- 生成事件包
- 持久化到后续分析与产品界面

如果没有 adapter，仓库中的其它模块就无法获得稳定、可信的源级证据。

## 当前 adapter 入口

当前实时接入流程围绕三个 preset 展开：

- `GOOGLE_NEWS`
- `GOOGLE_NEWS_SITE`
- `PASTE_URL`

这些 preset 定义在 `modules/source-adapters/index.ts`，并由 `lib/schemas.ts` 校验请求。

## 端到端接入流程

当前 live-source 流程如下：

1. 客户端向 `POST /api/intake/analyze` 提交信源接入请求
2. `sourceIntakeSchema` 校验输入参数
3. `fetchSourceDocuments()` 抓取并标准化外部内容
4. `buildSampleFromExternalDocuments()` 把标准化文档转换成 `RawEventSample`
5. `buildEventBundle()` 运行可解释事件引擎
6. `persistEventBundle()` 把结果写入 Prisma 模型
7. 新事件随即出现在首页、事件详情和市场等界面中

这种拆分是刻意设计的：

- adapter 负责抓取与标准化
- intake 负责拼装事件样本
- engine 负责推理
- persistence 负责保存结构化输出

## Adapter 输出契约

每个 adapter 都必须把结果标准化为 `ExternalDocument`。

必须提供的字段包括：

- `title`
- `summary`
- `url`
- `publishedAt`
- `sourceName`
- `sourceType`
- `sourceGrade`
- `signalType`
- `rawPayload`

这个契约很关键，因为下游代码默认这些输出已经足够规范，可以继续转换成 `RawSignalInput`，再进入事件包构建流程。

## 当前标准化能力

内置 adapter 层已经支持多种内容格式：

- RSS 或 Atom feed
- JSON payload
- 直接 HTML 页面

解析策略会根据响应 content type 和返回内容自动选择。

当前辅助能力包括：

- HTML 实体解码
- 标签剥离
- meta 信息提取
- RSS / Atom 解析
- 宽松 JSON 文章提取
- 单页 HTML 摘要提取
- 基于 hostname 的信源分类

## 信源分类

Adapter 不只是抓文档，还会附带第一层信源语义。

当前内置分类器会把 hostname 映射为：

- `sourceType`
- `sourceGrade`
- `signalType`

例如：

- 政府类域名通常会被识别为 `GOVERNMENT`，并倾向于 `OFFICIAL`
- 交易所或市场类域名可能被识别为 `EXCHANGE` 与 `MARKET`
- 投资者关系或 newsroom 域名可能被识别为 `CORPORATE`
- 其它站点则回落为高质量默认值 `MEDIA` / `NEWS`

这一步非常重要，因为信号聚合逻辑会根据 source type、grade、confidence 和确认数，决定一个事件是否应该进入主模型。

## Intake 样本构建

完成 adapter 标准化之后，`buildSampleFromExternalDocuments()` 会把文档继续提升为 `RawEventSample`。

这一层会补充：

- event id 与 cluster id
- 标题与摘要整形
- tags
- regions
- actors
- 基础 severity 与 confidence
- driver、constraint、trigger、market transmission 占位内容

随后它还会调用 classification engine，识别最佳事件家族，并替换成相应家族模板，让下游事件引擎从更合理的结构起步。

## 如何新增一个 adapter preset

最安全的扩展方式是：

1. 在 `LiveSourcePreset` 中新增 preset
2. 扩展 `sourceIntakeSchema`，让请求能被正确校验
3. 在 `fetchSourceDocuments()` 中接入新 preset
4. 把外部响应标准化为 `ExternalDocument[]`
5. 尽量复用现有 classification 和 intake 辅助逻辑
6. 用 `buildSampleFromExternalDocuments()` 与 `buildEventBundle()` 验证输出

大多数情况下，不应该为了支持新信源直接修改事件引擎本身。更合理的做法是让 adapter 层先吸收外部格式的复杂性。

## 新 adapter 的设计规则

新增 adapter 时建议遵循这些规则：

- adapter 逻辑尽量保持确定性
- 尽可能早地完成标准化
- 在 `rawPayload` 中保留原始上下文
- 不让 source-specific 逻辑泄漏到页面组件
- 当信源身份不明确时，宁可保守分类
- 当解析成功但内容不可分析时，返回明确可执行的错误信息

## 安全注意事项

Adapter 会接触不受信任的外部内容，因此需要特别注意：

- 异常 HTML 或 XML
- 缺失 meta 信息
- 不稳定的 JSON 结构
- 重复文章
- 模糊发布时间
- 对信源可信度的过度假设

由于 HEM-CM 是本地优先研究工具，所以“失败得可解释”通常比“静默猜测”更重要。

## 验证清单

当你新增或修改 adapter 时，至少应验证：

- schema 校验是否仍然正确
- adapter 是否能输出合法的 `ExternalDocument[]`
- intake 层是否能产出稳定的 `RawEventSample`
- 事件引擎是否仍会生成预测与市场映射
- 持久化是否能成功写入事件包
- `npm run build` 是否通过
- 如果影响 intake 或模型行为，`npm run validate` 是否通过

## 实用扩展方向

当前高价值 adapter 扩展包括：

- 结构化政府公告流
- 交易所公告流
- 企业 investor-relations 页面
- 质量更高的 JSON 新闻 API
- 面向固定研究流程的站点级 preset

## 总结

在 HEM-CM 中，adapter 不只是抓取器，它还是外部 Web 与内部事件引擎之间的信任边界和标准化边界。

只要 adapter 输出保持干净，仓库其余部分就能继续保持模块化、可解释，并且更容易进化。
