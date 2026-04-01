import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { getSettingsData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";

export default async function SettingsPage() {
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const data = await getSettingsData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.settings.eyebrow}
        title={dictionary.settings.title}
        description={dictionary.settings.description}
      />
      {data.preference ? (
        <SettingsForm
          defaultValues={{
            language: data.preference.language,
            theme: data.preference.theme,
            refreshMinutes: data.preference.refreshMinutes,
            demoMode: data.preference.demoMode,
            exportFormat: data.preference.exportFormat as "json" | "csv" | "pdf",
            preferredMarkets: data.preference.preferredMarkets
          }}
          sources={data.sources as never}
        />
      ) : null}
    </div>
  );
}
