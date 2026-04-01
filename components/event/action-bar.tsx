"use client";

import { Bell, Download, Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/lib/locale-provider";
import { useUiStore } from "@/lib/use-ui-store";

export function EventActionBar({ eventId }: { eventId: string }) {
  const [message, setMessage] = useState<string>("");
  const { toggleWatch, markSaved, watchlist } = useUiStore();
  const dictionary = useDictionary();

  async function handleAction(action: "watch" | "alert" | "export") {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });

    if (action === "watch") toggleWatch(eventId);
    if (action === "alert") markSaved(eventId);

    if (action === "export") {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${eventId}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage(dictionary.events.exportDone);
      return;
    }

    const data = await response.json();
    setMessage(data.message);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button variant={watchlist.includes(eventId) ? "secondary" : "default"} onClick={() => handleAction("watch")}>
          <Star className="h-4 w-4" />
          {dictionary.events.actionWatch}
        </Button>
        <Button variant="secondary" onClick={() => handleAction("alert")}>
          <Bell className="h-4 w-4" />
          {dictionary.events.actionAlert}
        </Button>
        <Button variant="outline" onClick={() => handleAction("export")}>
          <Download className="h-4 w-4" />
          {dictionary.events.actionExport}
        </Button>
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </div>
  );
}
