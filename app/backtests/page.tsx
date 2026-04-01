import { PageHeader } from "@/components/layout/page-header";
import { ComparisonPanels } from "@/components/backtest/comparison-panels";
import { ScorePlaybackChart } from "@/components/backtest/score-playback-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteSelect } from "@/components/ui/route-select";
import { getBacktestsData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";

export default async function BacktestsPage({
  searchParams
}: {
  searchParams?: Promise<{ eventId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const data = await getBacktestsData(params.eventId);

  if (!data.selected) {
    return (
      <Card>
        <CardContent className="p-8 text-muted-foreground">{dictionary.backtests.missingData}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.backtests.eyebrow}
        title={dictionary.backtests.title}
        description={dictionary.backtests.description}
      />

      <form className="max-w-sm">
        <RouteSelect
          basePath="/backtests"
          paramName="eventId"
          value={data.selected.eventId}
          options={data.items.map((item) => ({
            value: item.id,
            label: item.title
          }))}
        />
      </form>

      <div className="metric-grid">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.backtests.hitRate}</p>
            <p className="mt-3 text-3xl font-semibold">{data.selected.predictionHitRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.backtests.marketFit}</p>
            <p className="mt-3 text-3xl font-semibold">{data.selected.marketFitScore.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.backtests.replayWindow}</p>
            <p className="mt-3 text-lg font-semibold">{data.selected.replayWindow}</p>
          </CardContent>
        </Card>
      </div>

      <ScorePlaybackChart timeline={data.selected.timeline as never} />
      <ComparisonPanels
        predictions={data.selected.predictionSnapshot as never}
        actualOutcome={data.selected.actualOutcome as never}
        errorAnalysis={data.selected.errorAnalysis as never}
      />

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.backtests.summary}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{data.selected.summary}</CardContent>
      </Card>
    </div>
  );
}
