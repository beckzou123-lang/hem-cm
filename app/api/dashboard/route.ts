import { getDashboardData } from "@/lib/data";
import { getCurrentLocale } from "@/lib/locale";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = await getCurrentLocale();
  const data = await getDashboardData(
    {
      q: searchParams.get("q") ?? undefined,
      family: searchParams.get("family") ?? undefined
    },
    locale
  );
  return Response.json(data);
}
