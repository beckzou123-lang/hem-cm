import { ensureDatabaseSeeded } from "@/lib/seed-db";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await ensureDatabaseSeeded();
  const events = await prisma.event.findMany({ orderBy: [{ severityScore: "desc" }] });
  return Response.json(events);
}
