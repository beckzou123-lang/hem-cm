import { cookies } from "next/headers";

import { LOCALE_COOKIE_NAME, normalizeLocale } from "@/lib/i18n";
import { seedDatabase } from "@/lib/seed-db";

export async function POST() {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const result = await seedDatabase();
  return Response.json({ message: locale === "en-US" ? "Demo environment refreshed." : "演示环境已刷新。", result });
}
