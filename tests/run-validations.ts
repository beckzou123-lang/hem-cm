import assert from "node:assert/strict";

import { buildEventBundle } from "@/modules/event-engine";
import { buildSampleFromExternalDocuments } from "@/modules/intake-engine";
import { buildSeedBundle } from "@/modules/seed-engine";

function main() {
  const bundle = buildSeedBundle();
  const events = bundle.eventBundles;

  assert(events.length >= 6, "应至少生成 6 起样本事件");

  const mustHave = ["evt-mideast-iran-2026", "evt-trade-war-2026", "evt-russia-ukraine-2026"];
  mustHave.forEach((eventId) => {
    const event = events.find((item) => item.event.id === eventId);
    assert(event, `缺少关键真实案例 ${eventId}`);
    assert(event?.backtest, `${eventId} 应具备回测对象`);
    assert(event?.predictions.length === 15, `${eventId} 应包含 5 个时间窗 * 3 条路径`);
    assert(event?.impacts.length >= 30, `${eventId} 应输出完整市场映射`);
    assert(event?.backtest.predictionHitRate >= 50, `${eventId} 应具备有效回测结果`);
  });

  events.forEach((event) => {
    const d30 = event.predictions.filter((item) => item.horizon === "D30").reduce((sum, item) => sum + item.probability, 0);
    assert(Math.abs(d30 - 100) < 0.5, `${event.event.id} 的 30 天路径概率应接近 100`);
    assert((event.event.causalChain as { nodes: unknown[] }).nodes.length >= 7, `${event.event.id} 应存在结构化因果链`);
  });

  const liveSample = buildSampleFromExternalDocuments(
    {
      preset: "GOOGLE_NEWS_SITE",
      query: "伊朗 红海 航运",
      sourceSite: "reuters.com"
    },
    [
      {
        title: "Iran-linked tensions raise Red Sea shipping costs",
        summary: "Insurers and carriers reprice shipping risk as Middle East tensions remain elevated.",
        url: "https://example.com/red-sea-risk",
        publishedAt: "2026-03-25T08:00:00.000Z",
        sourceName: "Reuters",
        sourceType: "MEDIA",
        sourceGrade: "A",
        signalType: "NEWS",
        rawPayload: { hostname: "reuters.com" }
      },
      {
        title: "Oil and gold rise as markets price geopolitical premium",
        summary: "Brent crude and gold move higher after renewed disruption headlines.",
        url: "https://example.com/oil-gold-move",
        publishedAt: "2026-03-25T09:00:00.000Z",
        sourceName: "Reuters",
        sourceType: "MEDIA",
        sourceGrade: "A",
        signalType: "MARKET",
        rawPayload: { hostname: "reuters.com" }
      }
    ]
  );

  const liveBundle = buildEventBundle(liveSample, { includeBacktest: false });
  assert(liveBundle.event.sourceCount === 2, "实时接入样本应保留外部源信号数");
  assert(liveBundle.predictions.length === 15, "实时接入样本应生成完整路径预测");
  assert(liveBundle.impacts.length >= 20, "实时接入样本应生成市场映射");
  assert(liveBundle.backtest === null, "实时接入样本默认不伪造历史回测");

  console.log("Validation passed for", events.length, "events.");
}

main();
