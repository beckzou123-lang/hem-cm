"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDictionary } from "@/lib/locale-provider";

export function RiskHeatmap({ items }: { items: { label: string; score: number; count: number }[] }) {
  const dictionary = useDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.dashboard.riskHeatmapTitle}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/70 bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 flex-1 text-sm font-medium leading-5 text-foreground">{item.label}</p>
              <span className="shrink-0 whitespace-nowrap pt-0.5 text-xs text-muted-foreground">
                {item.count}
                {dictionary.dashboard.eventCountSuffix}
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="text-3xl font-semibold tracking-tight">{item.score.toFixed(1)}</div>
              <div
                className="h-14 w-14 shrink-0 rounded-2xl md:h-16 md:w-16"
                style={{ background: `linear-gradient(180deg, rgba(14,165,233,0.2), rgba(239,68,68,${Math.max(0.18, item.score / 100)}))` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
