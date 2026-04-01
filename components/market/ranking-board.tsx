"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDirectionLabels } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-provider";

export function RankingBoard({
  title,
  items
}: {
  title: string;
  items: { sectorName: string; direction: "POSITIVE" | "NEGATIVE" | "NEUTRAL"; strengthScore: number; phaseTag: string }[];
}) {
  const locale = useLocale();
  const directionLabels = getDirectionLabels(locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={`${title}-${item.sectorName}`} className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">{index + 1}</div>
              <div>
                <p className="font-medium">{item.sectorName}</p>
                <p className="text-xs text-muted-foreground">{item.phaseTag}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={item.direction === "POSITIVE" ? "success" : item.direction === "NEGATIVE" ? "danger" : "secondary"}>
                {directionLabels[item.direction]}
              </Badge>
              <span className="text-sm font-medium">{item.strengthScore.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
