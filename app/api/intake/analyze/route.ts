import { cookies } from "next/headers";

import { buildEventBundle } from "@/modules/event-engine";
import { buildSampleFromExternalDocuments } from "@/modules/intake-engine";
import { fetchSourceDocuments } from "@/modules/source-adapters";
import { persistEventBundle } from "@/lib/persist-event-bundle";
import { LOCALE_COOKIE_NAME, getDictionary, normalizeLocale } from "@/lib/i18n";
import { sourceIntakeSchema } from "@/lib/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const dictionary = getDictionary(locale);

  try {
    const payload = sourceIntakeSchema.parse(await request.json());
    const documents = await fetchSourceDocuments({ ...payload, locale });
    const sample = buildSampleFromExternalDocuments(payload, documents);
    const bundle = buildEventBundle(sample, { includeBacktest: false });
    const eventId = await persistEventBundle(bundle);

    return Response.json({
      ok: true,
      eventId,
      title: bundle.event.title,
      summary: bundle.event.summary,
      familyType: bundle.event.familyType,
      stage: bundle.event.currentStage,
      signalCount: bundle.signals.length,
      sourceCount: bundle.event.sourceCount
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? locale === "en-US"
          ? error.message
              .replace("请输入要接入的链接。", "Please enter a URL to ingest.")
              .replace("请输入要搜索的关键词。", "Please enter a keyword to search.")
              .replace("请输入要搜索的主题或关键词。", "Please enter a topic or keyword to search.")
              .replace("请输入指定数据源域名或站点。", "Please enter a source domain or website.")
          : error.message
        : dictionary.markets.analyzeFailed;
    return Response.json(
      {
        ok: false,
        message
      },
      { status: 400 }
    );
  }
}
