import cron from "node-cron";

import { prisma } from "@/lib/prisma";

if (typeof window !== "undefined") {
  throw new Error("Scheduler must not be imported in the browser.");
}

declare global {
  // eslint-disable-next-line no-var
  var hemSchedulerStarted: boolean | undefined;
}

export function ensureScheduler() {
  if (global.hemSchedulerStarted || process.env.NODE_ENV === "test") {
    return;
  }

  cron.schedule("*/15 * * * *", async () => {
    await prisma.userPreference.updateMany({
      where: { key: "default" },
      data: {
        value: {
          lastAutoRefresh: new Date().toISOString()
        }
      }
    });
  });

  global.hemSchedulerStarted = true;
}
