import { PageHeader } from "@/components/layout/page-header";
import { LiveSourceIntake } from "@/components/signal/live-source-intake";
import { SignalCenter } from "@/components/signal/signal-center";
import { getSignalsData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";
import { getDictionary } from "@/lib/i18n";

export default async function SignalsPage() {
  const locale = await getCurrentLocale();
  const dictionary = getDictionary(locale);
  const data = await getSignalsData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={dictionary.signals.eyebrow}
        title={dictionary.signals.title}
        description={dictionary.signals.description}
      />
      <LiveSourceIntake />
      <SignalCenter stream={data.stream as never} aggregated={data.aggregated as never} />
    </div>
  );
}
