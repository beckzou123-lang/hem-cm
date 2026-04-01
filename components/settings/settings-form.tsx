"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDictionary, useT } from "@/lib/locale-provider";
import { settingsUpdateSchema } from "@/lib/schemas";

type SettingsFormValues = {
  language: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  refreshMinutes: number;
  demoMode: boolean;
  exportFormat: "json" | "csv" | "pdf";
  preferredMarkets: string[];
};

export function SettingsForm({
  defaultValues,
  sources
}: {
  defaultValues: SettingsFormValues;
  sources: { id: string; sourceName: string; enabled: boolean; refreshCron: string; latencyHint: string }[];
}) {
  const router = useRouter();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues
  });
  const [message, setMessage] = useState("");
  const t = useT();
  const dictionary = useDictionary();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.settings.systemSettings}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
              });
              const result = await response.json();
              setMessage(result.message ?? dictionary.settings.saved);
              router.refresh();
            })}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.settings.language}</label>
                <Select {...form.register("language")}>
                  <option value="en-US">{dictionary.settings.english}</option>
                  <option value="zh-CN">{dictionary.settings.chinese}</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.settings.theme}</label>
                <Select {...form.register("theme")}>
                  <option value="SYSTEM">{dictionary.settings.followSystem}</option>
                  <option value="LIGHT">{dictionary.common.light}</option>
                  <option value="DARK">{dictionary.common.dark}</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.settings.refreshMinutes}</label>
                <Input type="number" {...form.register("refreshMinutes", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{dictionary.settings.export}</label>
                <Select {...form.register("exportFormat")}>
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </Select>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" {...form.register("demoMode")} />
                {dictionary.settings.demoMode}
              </label>
              <p className="mt-2 text-sm text-muted-foreground">{dictionary.settings.demoDescription}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{dictionary.settings.preferredMarkets}</label>
              <Input
                defaultValue={defaultValues.preferredMarkets.join(",")}
                onChange={(event) =>
                  form.setValue(
                    "preferredMarkets",
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>
            <Button type="submit">{dictionary.settings.save}</Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{dictionary.settings.dataSources}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sources.map((source) => (
            <div key={source.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{source.sourceName}</p>
                <span className="text-sm text-muted-foreground">{source.enabled ? dictionary.settings.enabled : dictionary.settings.disabled}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  {dictionary.settings.refresh}
                  {source.refreshCron}
                </p>
                <p>
                  {dictionary.settings.latency}
                  {source.latencyHint}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
