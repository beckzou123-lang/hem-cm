import { getMarketsData } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = await getMarketsData(searchParams.get("eventId") ?? undefined);
  return Response.json(data);
}
