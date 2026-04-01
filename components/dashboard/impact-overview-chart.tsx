"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDictionary } from "@/lib/locale-provider";

export function ImpactOverviewChart({
  items
}: {
  items: { label: string; score: number; positive?: { sectorName: string } | null; negative?: { sectorName: string } | null }[];
}) {
  const [mounted, setMounted] = useState(false);
  const dictionary = useDictionary();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.dashboard.impactOverviewTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="h-[260px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="label" stroke="currentColor" fontSize={12} />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full rounded-2xl bg-muted/30" />
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/70 bg-muted/30 p-4 text-sm">
              <p className="font-medium">{item.label}</p>
              <p className="mt-2 text-muted-foreground">
                {dictionary.dashboard.positiveTrack}：{item.positive?.sectorName ?? dictionary.dashboard.noPositiveTrack}
              </p>
              <p className="mt-1 text-muted-foreground">
                {dictionary.dashboard.negativeTrack}：{item.negative?.sectorName ?? dictionary.dashboard.noNegativeTrack}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
