import { PageHeader } from "@/components/layout/page-header";
import { EventRankList } from "@/components/dashboard/event-rank-list";
import { ImpactOverviewChart } from "@/components/dashboard/impact-overview-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { RiskHeatmap } from "@/components/dashboard/risk-heatmap";
import { SignalStream } from "@/components/dashboard/signal-stream";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDashboardData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary, getFamilyLabels } from "@/lib/i18n";

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; family?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const familyLabels = getFamilyLabels(locale);
  const data = await getDashboardData({ q: params.q, family: params.family }, locale);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border/70 bg-card/70 p-6 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <PageHeader
              eyebrow={dictionary.home.eyebrow}
              title={dictionary.home.title}
              description={dictionary.home.description}
            />
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">{dictionary.home.defaultChinese}</Badge>
              <Badge variant="secondary">{dictionary.home.englishAvailable}</Badge>
              <Badge variant="secondary">{dictionary.home.demoData}</Badge>
              <Badge variant="warning">{dictionary.home.realCases}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <a href="#event-list">{dictionary.home.viewEvents}</a>
            </Button>
            <Button asChild>
              <a href="/backtests">{dictionary.home.backtests}</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="metric-grid">
        <MetricCard title={dictionary.home.metrics.todayHotEvents} value={data.metrics.todayHotEvents} hint={dictionary.home.metrics.todayHotEventsHint} />
        <MetricCard title={dictionary.home.metrics.highRiskCount} value={data.metrics.highRiskCount} hint={dictionary.home.metrics.highRiskCountHint} />
        <MetricCard title={dictionary.home.metrics.newHighImpactCount} value={data.metrics.newHighImpactCount} hint={dictionary.home.metrics.newHighImpactCountHint} />
        <MetricCard title={dictionary.home.metrics.globalRisk} value={data.metrics.globalRisk.toFixed(1)} hint={dictionary.home.metrics.globalRiskHint} />
      </div>

      <section className="flex flex-wrap gap-2">
        <Button asChild variant={!params.family || params.family === "ALL" ? "default" : "outline"} size="sm">
          <a href="/">{dictionary.home.allFamilies}</a>
        </Button>
        {Object.entries(familyLabels).map(([family, label]) => (
          <Button key={family} asChild variant={params.family === family ? "default" : "outline"} size="sm">
            <a href={`/?family=${family}`}>{label}</a>
          </Button>
        ))}
      </section>

      <div id="event-list" className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <EventRankList items={data.featuredEvents} />
        <div className="space-y-6">
          <RiskHeatmap items={data.heatmap} />
          <ImpactOverviewChart items={data.marketOverview} />
        </div>
      </div>

      <SignalStream items={data.signals} />
    </div>
  );
}
