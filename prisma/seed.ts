import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-db";

async function main() {
  await seedDatabase();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("HEM-CM seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
