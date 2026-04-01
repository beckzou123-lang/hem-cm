"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/i18n";
import { useDictionary, useLocale } from "@/lib/locale-provider";

export function ScorePlaybackChart({ timeline }: { timeline: { date: string; modelScore: number; confidence: number }[] }) {
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const dictionary = useDictionary();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.backtests.scoreChart}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tickFormatter={(value) => formatDate(value, locale, { month: "numeric", day: "numeric" })} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="modelScore" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="confidence" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-2xl bg-muted/30" />
        )}
      </CardContent>
    </Card>
  );
}
