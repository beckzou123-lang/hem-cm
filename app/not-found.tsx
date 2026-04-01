import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";

export default async function NotFound() {
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);

  return (
    <Card>
      <CardContent className="space-y-4 p-8">
        <h2 className="text-2xl font-semibold">{dictionary.feedback.notFoundTitle}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{dictionary.feedback.notFoundDescription}</p>
        <Button asChild>
          <Link href="/">{dictionary.feedback.backHome}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
