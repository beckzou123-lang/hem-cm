import { Suspense } from "react";
import { Activity, Compass, Radar, Settings2 } from "lucide-react";
import Link from "next/link";

import { GlobalSearch } from "@/components/layout/global-search";
import { NavLink } from "@/components/layout/nav-link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";

const icons = [Radar, Activity, Compass, Settings2];

export function AppShell({
  children,
  dictionary,
  navItems
}: {
  children: React.ReactNode;
  dictionary: Dictionary;
  navItems: readonly { href: string; label: string }[];
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 md:px-6 lg:px-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-[28px] border border-border/70 bg-card/80 p-5 shadow-panel backdrop-blur xl:flex xl:flex-col">
          <div className="space-y-4">
            <div className="space-y-3">
              <Badge>{dictionary.shell.badge}</Badge>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">HEM-CM</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{dictionary.shell.description}</p>
              </div>
            </div>
            <nav className="grid gap-2">
              {navItems.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <div key={item.href} className="flex items-center gap-3 rounded-xl px-2 py-1">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <NavLink href={item.href} label={item.label} />
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto rounded-2xl border border-border/70 bg-muted/40 p-4">
            <p className="text-sm font-medium">{dictionary.shell.demoTitle}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {dictionary.shell.demoDescription}
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-4 z-30 mb-6 rounded-[28px] border border-border/70 bg-card/80 px-4 py-4 shadow-soft backdrop-blur md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="rounded-2xl border border-border/70 bg-muted/50 px-3 py-2 text-sm font-medium">
                  {dictionary.shell.terminal}
                </Link>
                <Badge variant="success">{dictionary.shell.builtInLoop}</Badge>
                <Button asChild size="sm" variant="secondary">
                  <Link href="/signals">{dictionary.shell.realSources}</Link>
                </Button>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Suspense fallback={<div className="h-10 w-full max-w-md rounded-xl border border-border/70 bg-muted/40 md:w-[320px]" />}>
                  <GlobalSearch />
                </Suspense>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <div className="space-y-6 pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
