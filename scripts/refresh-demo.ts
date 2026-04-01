import { seedDatabase } from "@/lib/seed-db";
import { prisma } from "@/lib/prisma";

async function main() {
  const result = await seedDatabase();
  const summary = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      severityScore: true,
      confidenceScore: true
    },
    orderBy: { severityScore: "desc" }
  });

  console.log("Demo refresh completed:", result);
  console.table(summary);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
