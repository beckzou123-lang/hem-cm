import { getSignalsData } from "@/lib/data";

export async function GET() {
  const data = await getSignalsData();
  return Response.json(data);
}
