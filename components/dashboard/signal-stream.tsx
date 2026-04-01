"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/i18n";
import { useDictionary, useLocale } from "@/lib/locale-provider";

export function SignalStream({
  items
}: {
  items: {
    id: string;
    headline: string;
    eventId: string;
    eventTitle: string;
    publishTime: Date;
    confidenceScore: number;
    sourceName: string;
    entersModel: boolean;
  }[];
}) {
  const locale = useLocale();
  const dictionary = useDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.dashboard.signalStreamTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <p className="font-medium">{item.headline}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{item.sourceName}</span>
                  <span>{formatDateTime(item.publishTime, locale)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.entersModel ? "success" : "secondary"}>{item.entersModel ? dictionary.dashboard.entersModel : dictionary.dashboard.observing}</Badge>
                <Badge variant="warning">
                  {dictionary.common.confidence} {item.confidenceScore.toFixed(1)}
                </Badge>
              </div>
            </div>
            <Link href={`/events/${item.eventId}`} className="mt-3 inline-flex text-sm text-primary">
              {dictionary.dashboard.linkedEvent}
              {item.eventTitle}
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
