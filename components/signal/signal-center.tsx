"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, getSourceGradeLabels } from "@/lib/i18n";
import { useDictionary, useLocale } from "@/lib/locale-provider";

type SignalRecord = {
  id: string;
  headline: string;
  sourceGrade: "S" | "A" | "B" | "C";
  sourceName: string;
  confidenceScore: number;
  entersModel: boolean;
  publishTime: Date;
  event: { title: string };
};

export function SignalCenter({
  stream,
  aggregated
}: {
  stream: SignalRecord[];
  aggregated: {
    eventId: string;
    title: string;
    confirmationCount: number;
    entersModel: boolean;
    confidenceTrend: number;
    topSignal?: SignalRecord;
  }[];
}) {
  const locale = useLocale();
  const dictionary = useDictionary();
  const sourceGradeLabels = getSourceGradeLabels(locale);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.signals.latestSignalStream}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stream.slice(0, 16).map((signal) => (
            <div key={signal.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-medium">{signal.headline}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{signal.event.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{signal.sourceName}</span>
                    <span>{formatDateTime(signal.publishTime, locale)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{sourceGradeLabels[signal.sourceGrade]}</Badge>
                  <Badge variant={signal.entersModel ? "success" : "warning"}>{signal.entersModel ? dictionary.signals.entersModel : dictionary.signals.pendingConfirm}</Badge>
                  <Badge>
                    {dictionary.signals.confidence} {signal.confidenceScore.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.signals.aggregatedEvents}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aggregated.map((item) => (
            <div key={item.eventId} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <p className="font-medium">{item.title}</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>
                  {dictionary.signals.confirmationStatus}
                  {item.confirmationCount}
                  {dictionary.signals.confirmationGroup}
                </p>
                <p>
                  {dictionary.signals.confidenceTrend}
                  {item.confidenceTrend.toFixed(1)}
                </p>
                <p>
                  {dictionary.signals.entersMainModel}
                  {item.entersModel ? dictionary.common.yes : dictionary.common.no}
                </p>
              </div>
              {item.topSignal ? (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {dictionary.signals.priorityAlert}
                  {item.topSignal.headline}
                </p>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
