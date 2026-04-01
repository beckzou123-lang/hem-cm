"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/lib/locale-provider";

type ModelRecord = {
  id: string;
  title: string;
  version: string;
  description: string;
  active: boolean;
  familyType: string | null;
  thresholds: Record<string, number>;
  variables: string[];
  visualFocus: string[];
};

export function ModelConfigEditor({ models }: { models: ModelRecord[] }) {
  const [message, setMessage] = useState("");
  const dictionary = useDictionary();

  async function handleSubmit(model: ModelRecord, formData: FormData) {
    const payload = {
      id: model.id,
      active: formData.get("active") === "on",
      version: String(formData.get("version")),
      description: String(formData.get("description")),
      thresholds: {
        highRiskSeverity: Number(formData.get("highRiskSeverity")),
        modelEntryConfidence: Number(formData.get("modelEntryConfidence")),
        pricedInTrigger: Number(formData.get("pricedInTrigger"))
      }
    };

    const response = await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setMessage(result.message);
  }

  return (
    <div className="space-y-4">
      {models.map((model) => (
        <Card key={model.id}>
          <CardHeader>
            <CardTitle>{model.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm">
                <p className="font-medium">{dictionary.models.variables}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.variables.map((variable) => (
                    <span key={variable} className="rounded-full bg-background/70 px-2.5 py-1 text-muted-foreground">
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm">
                <p className="font-medium">{dictionary.models.visualFocus}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.visualFocus.map((item) => (
                    <span key={item} className="rounded-full bg-background/70 px-2.5 py-1 text-muted-foreground">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm">
                <p className="font-medium">{dictionary.models.versionInfo}</p>
                <p className="mt-2 text-muted-foreground">
                  {dictionary.models.version}
                  {model.version}
                </p>
                <p className="mt-1 text-muted-foreground">{model.active ? dictionary.models.active : dictionary.models.standby}</p>
              </div>
            </div>
            <form
              className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr_0.7fr_0.7fr_0.7fr_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(model, new FormData(event.currentTarget));
              }}
            >
              <Input name="version" defaultValue={model.version} />
              <Textarea name="description" defaultValue={model.description} className="min-h-[44px]" />
              <Input name="highRiskSeverity" type="number" defaultValue={model.thresholds.highRiskSeverity ?? 76} />
              <Input name="modelEntryConfidence" type="number" defaultValue={model.thresholds.modelEntryConfidence ?? 63} />
              <Input name="pricedInTrigger" type="number" defaultValue={model.thresholds.pricedInTrigger ?? 62} />
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={model.active} />
                  {dictionary.models.enable}
                </label>
                <Button size="sm" type="submit">
                  {dictionary.models.save}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ))}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
