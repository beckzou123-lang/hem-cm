import { NextResponse } from "next/server";

import { getSettingsData } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE_NAME, getDictionary, normalizeLocale } from "@/lib/i18n";
import { settingsUpdateSchema } from "@/lib/schemas";

export async function GET() {
  const data = await getSettingsData();
  return Response.json(data);
}

export async function POST(request: Request) {
  const payload = settingsUpdateSchema.parse(await request.json());
  const locale = normalizeLocale(payload.language);
  const dictionary = getDictionary(locale);

  await prisma.userPreference.update({
    where: { key: "default" },
    data: {
      language: payload.language,
      theme: payload.theme,
      refreshMinutes: payload.refreshMinutes,
      demoMode: payload.demoMode,
      exportFormat: payload.exportFormat,
      preferredMarkets: payload.preferredMarkets
    }
  });

  const response = NextResponse.json({ message: dictionary.settings.saved });
  response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: "/", sameSite: "lax" });
  return response;
}
