"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getHorizonLabels } from "@/lib/i18n";
import { useDictionary, useLocale } from "@/lib/locale-provider";

type Prediction = {
  horizon: "D7" | "D30" | "D90" | "D180" | "D365";
  pathName: string;
  probability: number;
  expectedMarketEffect: string;
  explanation: string;
  conditions: string[];
  invalidationSignals: string[];
};

export function PredictionPanel({ predictions }: { predictions: Prediction[] }) {
  const [horizon, setHorizon] = useState<Prediction["horizon"]>("D30");
  const locale = useLocale();
  const dictionary = useDictionary();
  const horizonLabels = getHorizonLabels(locale);

  const scoped = useMemo(
    () => predictions.filter((item) => item.horizon === horizon).sort((a, b) => b.probability - a.probability),
    [horizon, predictions]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.events.pathPanel}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {Object.entries(horizonLabels).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setHorizon(key as Prediction["horizon"])}
              className={`rounded-full px-3 py-1.5 text-sm transition ${horizon === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {scoped.map((path) => (
            <div key={`${path.horizon}-${path.pathName}`} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{path.pathName}</p>
                <Badge>{path.probability.toFixed(1)}%</Badge>
              </div>
              <Progress value={path.probability} className="mt-3" />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.expectedMarketEffect}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="font-medium">{dictionary.events.conditions}</p>
                {path.conditions.map((condition) => (
                  <p key={condition} className="rounded-xl bg-background/60 px-3 py-2 text-muted-foreground">
                    {condition}
                  </p>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="font-medium">{dictionary.events.invalidationSignals}</p>
                {path.invalidationSignals.map((signal) => (
                  <p key={signal} className="rounded-xl bg-background/60 px-3 py-2 text-muted-foreground">
                    {signal}
                  </p>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{path.explanation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
