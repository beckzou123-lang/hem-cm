import { cookies } from "next/headers";

import { modelConfigUpdateSchema } from "@/lib/schemas";
import { getModelsData } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { LOCALE_COOKIE_NAME, getDictionary, normalizeLocale } from "@/lib/i18n";

export async function GET() {
  const data = await getModelsData();
  return Response.json(data);
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const dictionary = getDictionary(locale);
  const payload = modelConfigUpdateSchema.parse(await request.json());

  await prisma.modelConfig.update({
    where: { id: payload.id },
    data: {
      active: payload.active,
      version: payload.version,
      description: payload.description,
      thresholds: payload.thresholds
    }
  });

  return Response.json({ message: dictionary.models.updated });
}
