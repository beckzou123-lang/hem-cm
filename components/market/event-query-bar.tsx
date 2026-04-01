"use client";

import { LoaderCircle, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDictionary } from "@/lib/locale-provider";

type EventOption = {
  value: string;
  label: string;
};

function isUrlLike(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

export function EventQueryBar({
  basePath,
  selectedEventId,
  options
}: {
  basePath: string;
  selectedEventId: string;
  options: EventOption[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState(options.find((item) => item.value === selectedEventId)?.label ?? "");
  const [sourceSite, setSourceSite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dictionary = useDictionary();

  const matched = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return options.slice(0, 6);
    return options.filter((item) => item.label.toLowerCase().includes(keyword)).slice(0, 6);
  }, [options, query]);

  async function handleExistingSearch() {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      setError(dictionary.markets.inputEvent);
      return;
    }

    const exact = options.find((item) => item.label.toLowerCase() === keyword);
    const partial = matched[0];
    const target = exact ?? partial;

    if (!target) {
      setError(dictionary.markets.noMatch);
      return;
    }

    setError("");
    setMessage(`${dictionary.markets.switchedTo}${target.label}`);
    router.push(`${basePath}?eventId=${encodeURIComponent(target.value)}`);
  }

  async function handleLiveAnalyze() {
    const keyword = query.trim();
    if (!keyword) {
      setError(dictionary.markets.inputTheme);
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    const payload = isUrlLike(keyword)
      ? { preset: "PASTE_URL", url: keyword }
      : sourceSite.trim()
        ? { preset: "GOOGLE_NEWS_SITE", query: keyword, sourceSite: sourceSite.trim() }
        : { preset: "GOOGLE_NEWS", query: keyword };

    const response = await fetch("/api/intake/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok || !result.ok) {
      setError(result.message ?? dictionary.markets.analyzeFailed);
      return;
    }

    setMessage(`${dictionary.common.analyzing}${result.title}`);
    router.push(`${basePath}?eventId=${encodeURIComponent(result.eventId)}`);
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-[28px] border border-border/70 bg-card/70 p-4 shadow-soft">
      <div className="grid gap-3 xl:grid-cols-[1.2fr_0.7fr_auto_auto]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={dictionary.markets.queryPlaceholder} />
        <Input value={sourceSite} onChange={(event) => setSourceSite(event.target.value)} placeholder={dictionary.markets.sitePlaceholder} />
        <Button type="button" variant="secondary" onClick={handleExistingSearch}>
          <Search className="h-4 w-4" />
          {dictionary.markets.searchExisting}
        </Button>
        <Button type="button" onClick={handleLiveAnalyze} disabled={submitting}>
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {dictionary.markets.searchAndAnalyze}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {matched.map((item) => (
          <button
            key={item.value}
            type="button"
            className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            onClick={() => {
              setQuery(item.label);
              setError("");
              setMessage(`${dictionary.common.selected}${item.label}`);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <p className="text-sm text-muted-foreground">{dictionary.markets.selectPrompt}</p>
    </div>
  );
}
