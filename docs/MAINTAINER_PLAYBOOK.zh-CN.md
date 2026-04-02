# HEM-CM 维护者手册

这份手册是一份面向维护者的实际操作指南，用于帮助 HEM-CM 作为长期演进的开源仓库持续保持稳定。

## 维护者的核心目标

维护仓库时，需要同时守住四件事：

- 产品可信度
- 仓库清晰度
- 协作效率
- 安全与依赖卫生

当出现取舍时，优先选择那些能让仓库继续保持“容易理解、容易审查”的方案。

## 每日或每周巡检节奏

建议至少每周检查一次：

- 打开的 Pull Request
- 打开的 Issue
- Discussions 活跃情况
- CI 失败记录
- 依赖更新 PR
- 最近产品变化是否让 release notes、roadmap、README 出现陈旧表述

如果仓库本周比较安静，一次简短的周检通常就够了。

## 标准依赖更新处理流程

当收到依赖更新 PR 时，建议按这个顺序处理：

1. 看清楚更新的是哪个包，以及它是否属于框架关键依赖
2. 拉到本地分支
3. 执行标准验证路径
4. 在检查通过并完成一次快速产品冒烟后再决定是否合并

本地验证顺序建议固定为：

```bash
npm ci
cp .env.example .env
npm run db:init
npm run seed
npm run build
npm run validate
```

如果更新涉及 Next.js、React、Prisma、TypeScript 这类框架关键依赖，还应额外快速检查：

- 首页
- 事件详情页
- 信号页
- 设置页

## 构建与发布纪律

在每次重要版本发布前，建议至少完成以下动作：

1. 再跑一次 build 与 validate
2. 确认截图仍然和当前 UI 一致
3. 检查 README、路线图、Release Notes、社区文案有没有过时说法
4. 确认 Discussions、模板和贡献文档仍符合当前协作流程
5. 确认关键治理文件在 GitHub 页面仍可见

发布前可以直接以 `docs/REPO_CHECKLIST.md` 作为最后关口。

## Discussion 与 Issue 分流原则

建议坚持以下边界：

- Discussions 用于开放式想法、工作流反馈和社区交流
- Issues 用于可复现 bug、范围清晰的功能请求和具体任务
- Pull Request 用于已经实现并可审查的改动

处理时建议：

- 如果一个 Issue 还停留在探索阶段，就转到 Discussions
- 如果 Bug 报告还不能复现，就优先补充上下文，而不是直接排期
- 如果功能请求能映射到路线图主题，就顺手关联起来
- 关闭旧请求时，留下一句清晰说明，不要无解释关闭

## 安全事件处理

收到安全相关报告时：

- 不要要求对方公开披露细节
- 优先使用 private vulnerability reporting
- 如有必要，把沟通从公开 Issue 转移出去
- 在承诺发布时间前，先确认影响范围和受影响界面
- 修复完成后，再视情况写入 release notes 或 security advisory

具体上报规则以 `SECURITY.md` 为准。

## 文档联动维护

只要产品行为有变化，就应该在同一轮维护里检查相关文档。

常见需要联动的文件包括：

- `README.md`
- `README.zh-CN.md`
- `ROADMAP.md`
- `docs/RELEASE_*.md`
- `docs/COMMUNITY_POSTS.md`
- `docs/ARCHITECTURE.md`
- `docs/ADAPTER_GUIDE.md`
- `docs/MODEL_GUIDE.md`
- 对应中文镜像文档

如果仓库新增了一个核心工作流，也应该同时更新产品文档与维护者文档。

## GitHub 设置巡检

建议定期确认：

- private vulnerability reporting 仍然开启
- Discussions 仍然开启
- funding links 仍然正确
- CODEOWNERS 仍然符合当前评审边界
- issue / PR 模板仍匹配当前协作流程
- CI 仍然覆盖 `push`、`pull_request` 和手动触发

## Dependabot 处理规则

仓库现在已接入 Dependabot，用于 npm 与 GitHub Actions 更新。

建议处理方式如下：

- patch / minor 更新：CI 通过后做一次快速审阅即可考虑合并
- 框架关键升级：需要更谨慎，最好加一次本地冒烟验证
- 不要把互不相关的 breaking change 一起合并
- 如果依赖 PR 会破坏 `build` 或 `validate`，就先记录原因并延后处理

## 什么时候适合发版

满足以下条件时，通常就适合切一个 release：

- 核心工作流稳定
- 文档与当前产品一致
- 社区入口在正常使用
- 安全与治理文件是最新的
- 最近没有把仓库拖红的依赖更新

如果以上条件有明显缺口，优先再做一轮清理，而不是急着打 tag。

## 维护者快速清单

做一次快速巡检时，至少确认：

- CI 绿色
- 打开的依赖更新 PR 已经分流处理
- 没有严重 bug 报告长时间无人响应
- README 与截图仍然是当前状态
- 路线图与发布文案没有误导性陈述
- 安全上报仍然开启
- Sponsor / Funding 仍指向预期维护者账号

## 总结

最健康的维护模式其实很简单：

- 让产品一直可运行
- 让仓库一直可解释
- 让协作流程一直轻量
- 让安全与依赖处理一直可见、可重复

比起堆很多流程，持续保持这种节奏更重要。
