"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDictionary } from "@/lib/locale-provider";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const dictionary = useDictionary();

  return (
    <Card>
      <CardContent className="space-y-4 p-8">
        <h2 className="text-2xl font-semibold">{dictionary.feedback.errorTitle}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{dictionary.feedback.errorDescription}</p>
        <Button onClick={() => reset()}>{dictionary.feedback.reload}</Button>
      </CardContent>
    </Card>
  );
}
