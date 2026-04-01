import { notFound } from "next/navigation";

import { EventActionBar } from "@/components/event/action-bar";
import { CausalChainGraph } from "@/components/event/causal-chain-graph";
import { ImpactGrid } from "@/components/event/impact-grid";
import { PredictionPanel } from "@/components/event/prediction-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEventDetail } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { formatDateTime, getDictionary, getFamilyLabels, getStageLabels } from "@/lib/i18n";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const familyLabels = getFamilyLabels(locale);
  const stageLabels = getStageLabels(locale);
  const event = await getEventDetail(id);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-border/70 bg-card/70 p-6 shadow-panel backdrop-blur">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <PageHeader eyebrow={dictionary.events.eyebrow} title={event.title} description={event.summary} />
            <div className="flex flex-wrap gap-2">
              <Badge>{familyLabels[event.familyType]}</Badge>
              <Badge variant="warning">{stageLabels[event.currentStage]}</Badge>
              <Badge variant="secondary">
                {dictionary.common.severity} {event.severityScore.toFixed(1)}
              </Badge>
              <Badge variant="secondary">
                {dictionary.common.confidence} {event.confidenceScore.toFixed(1)}
              </Badge>
            </div>
          </div>
          <EventActionBar eventId={event.id} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.events.overview}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium">{dictionary.events.classification}</p>
              <p className="mt-2 text-muted-foreground">{event.explanation.classification}</p>
              <p className="mt-2 text-muted-foreground">{event.stageExplanation}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="font-medium">{dictionary.events.drivers}</p>
                <div className="mt-2 space-y-2">
                  {event.driverSummary.map((item) => (
                    <p key={item} className="text-muted-foreground">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="font-medium">{dictionary.events.constraints}</p>
                <div className="mt-2 space-y-2">
                  {event.constraintSummary.map((item) => (
                    <p key={item} className="text-muted-foreground">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium">{dictionary.events.triggers}</p>
              <div className="mt-2 space-y-2">
                {event.triggerSummary.map((item) => (
                  <p key={item} className="text-muted-foreground">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dictionary.events.actors}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {event.actors.map((actor) => (
              <div key={actor.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{actor.name}</p>
                  <Badge variant="secondary">{actor.leverageScore.toFixed(0)}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{actor.role}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{actor.objective}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {dictionary.events.stance}
                  {actor.stance}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <CausalChainGraph chain={event.causalChain as never} />
      <PredictionPanel predictions={event.predictions as never} />
      <ImpactGrid impacts={event.marketImpacts as never} />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.events.transmission}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(event.marketTransmission as string[]).map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{dictionary.events.signals}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {event.signals.slice(0, 8).map((signal) => (
              <div key={signal.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{signal.headline}</p>
                  <Badge variant={signal.validatedFlag ? "success" : "secondary"}>
                    {signal.validatedFlag ? dictionary.events.validated : dictionary.events.pendingConfirm}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{signal.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{signal.sourceName}</span>
                  <span>
                    {dictionary.common.confidence} {signal.confidenceScore.toFixed(1)}
                  </span>
                  <span>{formatDateTime(signal.publishTime, locale)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
