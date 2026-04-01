"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDirectionLabels, getMarketLabels } from "@/lib/i18n";
import { useDictionary, useLocale } from "@/lib/locale-provider";

type Impact = {
  market: "CN_SOCIETY" | "A_SHARE" | "US_EQUITY" | "COMMODITY" | "MACRO";
  sectorName: string;
  direction: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  strengthScore: number;
  pricedInScore: number;
  crowdingScore: number;
  phaseTag: string;
  explanation: string;
};

export function ImpactGrid({ impacts }: { impacts: Impact[] }) {
  const locale = useLocale();
  const dictionary = useDictionary();
  const marketLabels = getMarketLabels(locale);
  const directionLabels = getDirectionLabels(locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.events.impactGrid}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {Object.entries(marketLabels).map(([market, label]) => {
          const scoped = impacts.filter((item) => item.market === market).sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 5);
          return (
            <div key={market} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{label}</h3>
                <Badge variant="secondary">{scoped[0]?.phaseTag ?? dictionary.common.observing}</Badge>
              </div>
              <div className="grid gap-3 xl:grid-cols-5">
                {scoped.map((impact) => (
                  <div key={`${impact.market}-${impact.sectorName}`} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{impact.sectorName}</p>
                      <Badge variant={impact.direction === "POSITIVE" ? "success" : impact.direction === "NEGATIVE" ? "danger" : "secondary"}>
                        {directionLabels[impact.direction]}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                      <p>
                        {dictionary.events.strength} {impact.strengthScore.toFixed(1)}
                      </p>
                      <p>
                        {dictionary.events.pricedIn} {impact.pricedInScore.toFixed(1)}
                      </p>
                      <p>
                        {dictionary.events.crowding} {impact.crowdingScore.toFixed(1)}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{impact.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
