# HEM-CM 宣传文案包（中文）

## 一句话定位

面向资本市场的开源事件智能研究终端。

## 两句话定位

HEM-CM 把突发新闻与热点事件转成可解释的因果链、多情景路径推演、跨市场影响映射和可回放的研究工作流。

它把事件建模、市场映射、实时信源接入与回测回放整合为一个本地优先的完整产品。

## 核心传播角度

- 强调可解释，而不是黑盒
- 强调事件理解，而不是单纯资讯聚合
- 强调跨市场映射，而不是单一资产视角
- 强调可回放验证，而不是只做预测展示
- 强调 AI-ready，但即使不依赖远程模型也已具备实际价值

## 补丁更新 – v1.0.1

### 短版文案

HEM-CM v1.0.1 已发布。

这次补丁更新重点是依赖安全与仓库维护质量完善。

v1.0.1 包含：

- 升级 `prisma` 到 `^6.19.3`
- 升级 `@prisma/client` 到 `^6.19.3`
- 关闭此前报告的高危 Dependabot 告警
- 同步 README 与 Release Notes 入口，降低新访客理解门槛

Release：
https://github.com/beckzou123-lang/hem-cm/releases/tag/v1.0.1

### 长版文案

HEM-CM v1.0.1 已作为补丁版本发布。

这次更新不增加新的产品页面，而是把重点放在把仓库打磨成持续维护中的成熟开源项目：完成 Prisma 依赖链修复、关闭此前的高危 Dependabot 告警，并同步仓库内的发布文档与入口。

为什么这次更新值得说：

- 默认分支已经运行在修复后的依赖链上
- Release 元数据和仓库入口更干净、更容易理解
- GitHub Release、仓库文档和 Discussions 三个公开面已经形成一致的维护闭环

项目地址：
https://github.com/beckzou123-lang/hem-cm

Release：
https://github.com/beckzou123-lang/hem-cm/releases/tag/v1.0.1

## 首发文案 – X / 短帖

HEM-CM 已正式开源。

它把资本市场里的突发新闻与热点事件转成因果链、路径推演、跨市场影响映射和可回放的研究工作流。

当前已包含：

- 事件作战室
- 资本市场作战台
- 高频信号中心
- 回测实验室

项目地址：https://github.com/beckzou123-lang/hem-cm

## 首发文案 – LinkedIn / 长帖

今天我把 HEM-CM 开源了，它是一款面向资本市场的事件智能研究终端。

这个项目的目标很直接：不再停留在“资讯聚合”，而是让事件推演过程变得可检查、可解释、可验证。

在 HEM-CM 里，一个事件会被拆成：

- 因果链
- 阶段感知的路径推演
- 跨市场影响映射
- 可回放的回测与验证视图

首个公开版本已经包含：

- 一套可复用的因果母模型 + 六类子模型
- 全局态势台、事件作战室、资本市场作战台、高频信号中心、回测实验室
- 基于 Prisma + SQLite 的本地优先运行方式
- 默认英文、支持中文切换的双语体验

它尤其适合事件驱动研究员、PM、宏观分析者，以及关注可解释 AI 金融工具的开发者。

项目地址：
https://github.com/beckzou123-lang/hem-cm

我最想收集的反馈是：

- 下一步最值得扩展的事件家族是什么
- 最重要的信源接入应该优先做哪些
- 哪个推演链路还不够透明

## 首发文案 – GitHub Discussion / 社区

HEM-CM 是一款已经公开发布的开源事件智能研究终端，面向资本市场。

它适合那些希望真正看清一个事件如何被分类、如何分阶段演进、如何被推导成多条情景路径，以及如何映射到下游市场影响的人。

首个公开版本包含：

- 因果母模型 + 六类事件子模型
- 多时间窗路径预测
- 跨市场映射
- 实时信源接入
- 回放与回测工作流

可直接访问的入口：

- README：https://github.com/beckzou123-lang/hem-cm
- 中文 README：https://github.com/beckzou123-lang/hem-cm/blob/main/README.zh-CN.md

我现在最想收到的反馈包括：

- 模型是否足够透明
- 文档是否足够清晰
- 下一步最值得支持的信源接入是什么

## 视觉素材

- 社交封面 PNG：`public/social/hem-cm-social.png`
- 社交封面 SVG：`public/social/hem-cm-social.svg`
- 截图素材：
  - `assets/screenshots/01-dashboard.png`
  - `assets/screenshots/02-event-war-room.png`
  - `assets/screenshots/03-markets.png`
  - `assets/screenshots/04-backtests.png`

## 发布检查清单

- 发布 tag 与 Release
- 维护版本更新时同步补一条 patch update 文案
- 需要时可置顶仓库
- 使用短版文案对外分享 GitHub 链接
- 使用长版文案复用到朋友圈、公众号、知乎、LinkedIn 或创始人更新
- 关注首周进入仓库的 Issues 与 Discussions 反馈
