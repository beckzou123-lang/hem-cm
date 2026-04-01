import { EventQueryBar } from "@/components/market/event-query-bar";
import { PageHeader } from "@/components/layout/page-header";
import { RankingBoard } from "@/components/market/ranking-board";
import { TransmissionGraph } from "@/components/market/transmission-graph";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMarketsData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary, translateStageLabel } from "@/lib/i18n";

export default async function MarketsPage({
  searchParams
}: {
  searchParams?: Promise<{ eventId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const data = await getMarketsData(params.eventId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.markets.eyebrow}
        title={dictionary.markets.title}
        description={dictionary.markets.description}
      />

      <EventQueryBar
        basePath="/markets"
        selectedEventId={data.selectedEvent.id}
        options={data.events.map((event) => ({
          value: event.id,
          label: event.title
        }))}
      />

      <div className="metric-grid">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.markets.eventDriveScore}</p>
            <p className="mt-3 text-3xl font-semibold">{data.summary.eventDriveScore.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.markets.pricedIn}</p>
            <p className="mt-3 text-3xl font-semibold">{data.summary.pricedIn.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.markets.expectationGap}</p>
            <p className="mt-3 text-3xl font-semibold">{data.summary.expectationGap.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{dictionary.markets.stageLabel}</p>
            <div className="mt-3 flex gap-2">
              <Badge>{translateStageLabel(data.selectedEvent.currentStage, locale)}</Badge>
              <Badge variant="warning">{dictionary.markets.crowdingWatch}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RankingBoard title={dictionary.markets.aSharePositive} items={data.rankings.aSharePositive as never} />
        <RankingBoard title={dictionary.markets.aShareNegative} items={data.rankings.aShareNegative as never} />
        <RankingBoard title={dictionary.markets.usPositive} items={data.rankings.usPositive as never} />
        <RankingBoard title={dictionary.markets.usNegative} items={data.rankings.usNegative as never} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <RankingBoard title={dictionary.markets.commodities} items={data.rankings.commodities as never} />
        <RankingBoard title={dictionary.markets.riskOff} items={data.rankings.riskOff as never} />
      </div>

      <TransmissionGraph title={dictionary.markets.transmission} links={data.selectedEvent.marketTransmission as never} />

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.markets.summary}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-7 text-muted-foreground">{data.selectedEvent.summary}</CardContent>
      </Card>
    </div>
  );
}
