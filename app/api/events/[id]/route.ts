import { cookies } from "next/headers";

import { exportEventBundle, getEventDetail } from "@/lib/data";
import { LOCALE_COOKIE_NAME, getDictionary, normalizeLocale } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventDetail(id);
  if (!event) return new Response("Not found", { status: 404 });
  return Response.json(event);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { action } = await request.json();
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const dictionary = getDictionary(locale);

  if (action === "watch") {
    await prisma.alertRule.create({
      data: {
        id: `watch-${id}-${Date.now()}`,
        eventId: id,
        name: dictionary.events.actionWatch,
        scope: "watchlist",
        condition: { eventId: id },
        enabled: true
      }
    });
    return Response.json({ message: dictionary.events.watchDone });
  }

  if (action === "alert") {
    await prisma.alertRule.create({
      data: {
        id: `alert-${id}-${Date.now()}`,
        eventId: id,
        name: dictionary.events.actionAlert,
        scope: "alert",
        condition: { severityAbove: 75, confirmationAtLeast: 2 },
        enabled: true
      }
    });
    return Response.json({ message: dictionary.events.alertDone });
  }

  if (action === "export") {
    const eventBundle = await exportEventBundle(id, locale);
    if (!eventBundle) return new Response("Not found", { status: 404 });

    return new Response(JSON.stringify(eventBundle, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${id}.json"`
      }
    });
  }

  return Response.json({ message: dictionary.events.unknownAction }, { status: 400 });
}
