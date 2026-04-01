"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle, RadioTower, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDictionary, useLocale } from "@/lib/locale-provider";

type IntakePreset = "GOOGLE_NEWS" | "GOOGLE_NEWS_SITE" | "PASTE_URL";

export function LiveSourceIntake() {
  const router = useRouter();
  const locale = useLocale();
  const dictionary = useDictionary();
  const [preset, setPreset] = useState<IntakePreset>("GOOGLE_NEWS");
  const [query, setQuery] = useState(locale === "zh-CN" ? "伊朗 红海 航运" : "Iran Red Sea shipping");
  const [sourceSite, setSourceSite] = useState("reuters.com");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<null | {
    eventId: string;
    title: string;
    summary: string;
    signalCount: number;
  }>(null);

  const presetOptions: Array<{ value: IntakePreset; label: string; hint: string }> = [
    {
      value: "GOOGLE_NEWS",
      label: locale === "zh-CN" ? "Google News 实时检索" : "Google News Live Search",
      hint: locale === "zh-CN" ? "按关键词抓取最新公开报道，自动聚合为主事件。" : "Fetch the latest public reports by keyword and aggregate them into a primary event."
    },
    {
      value: "GOOGLE_NEWS_SITE",
      label: locale === "zh-CN" ? "指定站点检索" : "Site-Specific Search",
      hint: locale === "zh-CN" ? "按关键词 + 指定域名检索，例如 `reuters.com`、`sec.gov`。" : "Search by keyword and domain, such as `reuters.com` or `sec.gov`."
    },
    {
      value: "PASTE_URL",
      label: locale === "zh-CN" ? "粘贴 RSS / 网页链接" : "Paste RSS / Web URL",
      hint: locale === "zh-CN" ? "支持直接粘贴 RSS、Atom、JSON 接口或网页链接。" : "Directly paste RSS, Atom, JSON endpoints, or webpage URLs."
    }
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/intake/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preset,
        query,
        sourceSite,
        url
      })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok || !payload.ok) {
      setError(payload.message ?? dictionary.markets.analyzeFailed);
      return;
    }

    setResult({
      eventId: payload.eventId,
      title: payload.title,
      summary: payload.summary,
      signalCount: payload.signalCount
    });
    router.refresh();
  }

  return (
    <Card className="border-primary/20 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RadioTower className="h-5 w-5 text-primary" />
          {dictionary.signals.liveIntakeTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{dictionary.signals.intakeMode}</label>
              <Select value={preset} onChange={(event) => setPreset(event.target.value as IntakePreset)}>
                {presetOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-muted-foreground">{presetOptions.find((item) => item.value === preset)?.hint}</p>
            </div>

            {preset !== "PASTE_URL" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.signals.searchTopic}</label>
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={dictionary.signals.queryExample} />
              </div>
            ) : null}

            {preset === "GOOGLE_NEWS_SITE" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.signals.sourceSite}</label>
                <Input value={sourceSite} onChange={(event) => setSourceSite(event.target.value)} placeholder={dictionary.signals.siteExample} />
              </div>
            ) : null}

            {preset === "PASTE_URL" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.signals.pasteUrl}</label>
                <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder={dictionary.signals.urlExample} />
              </div>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {dictionary.signals.submit}
            </Button>
          </div>

          <div className="rounded-[28px] border border-border/70 bg-muted/20 p-5">
            <p className="text-sm font-medium">{dictionary.signals.systemWill}</p>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <p>{dictionary.signals.step1}</p>
              <p>{dictionary.signals.step2}</p>
              <p>{dictionary.signals.step3}</p>
              <p>{dictionary.signals.step4}</p>
            </div>

            {error ? <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</p> : null}

            {result ? (
              <div className="mt-4 rounded-2xl border border-success/20 bg-success/5 p-4">
                <p className="text-sm font-medium text-foreground">{dictionary.signals.analyzeDone}</p>
                <p className="mt-2 font-medium">{result.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.summary}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {dictionary.signals.signalsIngested}
                  {result.signalCount}
                  {dictionary.signals.signalSuffix}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href={`/events/${result.eventId}`}>{dictionary.signals.enterEvent}</Link>
                  </Button>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/markets?eventId=${result.eventId}`}>{dictionary.signals.viewMarkets}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-background/40 p-4 text-sm text-muted-foreground">
                {dictionary.signals.placeholder}
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
