"use client";

import type { CausalChain } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDictionary } from "@/lib/locale-provider";

const colorMap = {
  driver: "from-sky-500/20 to-sky-500/5 text-sky-600 dark:text-sky-300",
  actor: "from-teal-500/20 to-teal-500/5 text-teal-600 dark:text-teal-300",
  incentive: "from-indigo-500/20 to-indigo-500/5 text-indigo-600 dark:text-indigo-300",
  constraint: "from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-300",
  trigger: "from-rose-500/20 to-rose-500/5 text-rose-600 dark:text-rose-300",
  response: "from-orange-500/20 to-orange-500/5 text-orange-600 dark:text-orange-300",
  diffusion: "from-cyan-500/20 to-cyan-500/5 text-cyan-600 dark:text-cyan-300",
  market: "from-emerald-500/20 to-emerald-500/5 text-emerald-600 dark:text-emerald-300"
} as const;

export function CausalChainGraph({ chain }: { chain: CausalChain }) {
  const dictionary = useDictionary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{dictionary.events.causalChain}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-4">
          {chain.nodes.map((node) => (
            <div key={node.id} className={`rounded-2xl border border-border/70 bg-gradient-to-br p-4 ${colorMap[node.kind]}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium uppercase tracking-[0.18em]">{node.kind}</p>
                <span className="text-sm font-semibold">{node.score.toFixed(1)}</span>
              </div>
              <p className="mt-3 font-medium text-foreground">{node.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{node.detail}</p>
              <div className="mt-3 space-y-1">
                {node.evidence.slice(0, 2).map((evidence) => (
                  <p key={evidence} className="rounded-xl bg-background/50 px-3 py-2 text-xs text-foreground/80">
                    {evidence}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {chain.edges.map((edge) => (
              <div key={`${edge.source}-${edge.target}`} className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm">
              <p className="font-medium">
                {edge.source} {"->"} {edge.target}
              </p>
              <p className="mt-2 leading-6 text-muted-foreground">{edge.explanation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
