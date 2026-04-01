"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDictionary } from "@/lib/locale-provider";

export function ComparisonPanels({
  predictions,
  actualOutcome,
  errorAnalysis
}: {
  predictions: { pathName: string; probability: number; horizon: string }[];
  actualOutcome: { headline?: string; marketOutcome?: string; realizedEffects?: string[]; outcomePath?: string };
  errorAnalysis: { misses?: string[]; strengths?: string[]; versionDelta?: string };
}) {
  const dictionary = useDictionary();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.backtests.comparisonTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {predictions.map((prediction) => (
            <div key={`${prediction.horizon}-${prediction.pathName}`} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{prediction.pathName}</p>
                <Badge>{prediction.horizon}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {dictionary.backtests.probability} {prediction.probability.toFixed(1)}%
              </p>
            </div>
          ))}
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
            <p className="font-medium">{dictionary.backtests.actualOutcome}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{actualOutcome.headline}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {dictionary.backtests.outcomePath}
              {actualOutcome.outcomePath}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.backtests.errorTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">{dictionary.backtests.strengths}</p>
            <div className="mt-2 space-y-2">
              {errorAnalysis.strengths?.map((item) => (
                <p key={item} className="rounded-2xl bg-success/10 px-3 py-2 text-sm text-success">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">{dictionary.backtests.misses}</p>
            <div className="mt-2 space-y-2">
              {errorAnalysis.misses?.map((item) => (
                <p key={item} className="rounded-2xl bg-danger/10 px-3 py-2 text-sm text-danger">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <p className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">{errorAnalysis.versionDelta}</p>
        </CardContent>
      </Card>
    </div>
  );
}
