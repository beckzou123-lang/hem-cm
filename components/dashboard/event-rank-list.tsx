"use client";

import Link from "next/link";
import { ArrowRight, Radar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDictionary } from "@/lib/locale-provider";

export function EventRankList({
  items
}: {
  items: {
    id: string;
    title: string;
    familyLabel: string;
    stageLabel: string;
    severityScore: number;
    confidenceScore: number;
    summary: string;
    tags: string[];
    topPath?: { pathName: string; probability: number } | null;
  }[];
}) {
  const dictionary = useDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.dashboard.eventRankTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <Link key={item.id} href={`/events/${item.id}`} className="block rounded-2xl border border-border/70 bg-muted/20 p-4 transition hover:border-primary/40 hover:bg-muted/50">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">{index + 1}</div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.familyLabel}</Badge>
                      <Badge variant="warning">{item.stageLabel}</Badge>
                    </div>
                  </div>
                </div>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{item.summary}</p>
              </div>
              <div className="min-w-[220px] space-y-3">
                <div className="rounded-2xl border border-border/70 bg-card/70 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{dictionary.dashboard.eventHeat}</span>
                    <span className="font-medium">{item.severityScore.toFixed(1)}</span>
                  </div>
                  <Progress value={item.severityScore} className="mt-2" />
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/70 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{dictionary.dashboard.topPath}</span>
                    <Radar className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 font-medium">{item.topPath?.pathName ?? dictionary.dashboard.waitingPath}</p>
                  <p className="mt-1 text-muted-foreground">{item.topPath ? `${item.topPath.probability.toFixed(1)}%` : dictionary.common.notCalculated}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-primary">
                {dictionary.dashboard.enterRoom} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
