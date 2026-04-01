import { PageHeader } from "@/components/layout/page-header";
import { ModelConfigEditor } from "@/components/model/model-config-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getModelsData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";

export default async function ModelsPage() {
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const data = await getModelsData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.models.eyebrow}
        title={dictionary.models.title}
        description={dictionary.models.description}
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <ModelConfigEditor models={data.models as never} />
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.models.sourceRules}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.sources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="font-medium">{source.sourceName}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {dictionary.models.refreshRate}
                  {source.refreshCron}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dictionary.models.latencyHint}
                  {source.latencyHint}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
