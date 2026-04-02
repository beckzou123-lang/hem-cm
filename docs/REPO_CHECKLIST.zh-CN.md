# HEM-CM 仓库验收清单

这份清单用于做 HEM-CM 的最终开源发布验收，主要面向维护者，帮助确认仓库在可运行、可审查、可协作和可传播几个维度上都保持稳定。

## 产品可用性

- [x] 应用可在本地通过演示数据跑起来
- [x] `npm run build` 通过
- [x] `npm run validate` 通过
- [x] 核心产品界面可用：首页、事件详情、市场、信号、回测、模型、设置
- [x] 已具备英文优先的双语产品界面

## 仓库展示面

- [x] README 首屏能清晰表达产品定位
- [x] README 已包含截图与快速启动说明
- [x] 已提供中文 README
- [x] GitHub About 文案已准备
- [x] Social Preview 资产已准备
- [x] Release Notes 已准备
- [x] 路线图已发布
- [x] 社区投递文案已准备

## 社区与协作流程

- [x] Discussions 已启用
- [x] 欢迎帖已发布
- [x] 功能优先级征集帖已发布
- [x] CONTRIBUTING 指南已存在
- [x] Issue 模板已存在
- [x] Pull Request 模板已存在
- [x] Code of Conduct 已存在
- [x] CODEOWNERS 已存在

## 信任与治理

- [x] SECURITY.md 已存在
- [x] FUNDING.yml 已存在
- [x] 架构文档已存在
- [x] Adapter 指南已存在
- [x] 模型指南已存在
- [x] 架构与关键贡献文档已补齐中文镜像

## GitHub 可见性检查

- [x] SECURITY.md 已在 GitHub 页面可见
- [x] CODEOWNERS 已在 GitHub 页面可见
- [x] FUNDING.yml 已在 GitHub 页面可见
- [x] 中文架构文档已在 GitHub 页面可见
- [x] GitHub 仓库设置中的私密漏洞上报已人工确认开启
- [ ] GitHub Sponsors 按钮已人工确认在仓库页展示

## 仍需人工确认的事项

这些事项通常依赖 GitHub 平台设置或维护者账号状态：

- 到 GitHub 仓库设置中确认 private vulnerability reporting 已开启
- 如果希望仓库展示赞助入口，需要确认维护者账号已启用 GitHub Sponsors
- 每次重要产品更新后刷新截图与对外文案
- 保持 Release、Roadmap 与 Community 文案和当前产品能力一致

## 建议的发布纪律

每次重要版本发布前，建议重新完成以下检查：

1. 再次执行 build 与 validate
2. 确认 README 截图仍与当前产品一致
3. 检查 Release Notes 与 Roadmap 是否有过期表述
4. 检查 Security 与 Contributing 文档是否需要更新
5. 确认 Discussions 与 Issue 模板仍适配当前协作流程

## 总结

如果以上已勾选项持续成立，说明仓库在以下几个维度上都处于较强状态：

- 首屏观感
- 技术审查
- 贡献者 onboarding
- 社区互动
- 后续开源迭代
