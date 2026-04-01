import { z } from "zod";

export const modelConfigUpdateSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  version: z.string().min(1),
  description: z.string().min(10),
  thresholds: z.record(z.string(), z.number())
});

export const settingsUpdateSchema = z.object({
  language: z.string().min(2),
  theme: z.enum(["LIGHT", "DARK", "SYSTEM"]),
  refreshMinutes: z.number().min(5).max(120),
  demoMode: z.boolean(),
  exportFormat: z.enum(["json", "csv", "pdf"]),
  preferredMarkets: z.array(z.string()).min(1)
});

export const sourceIntakeSchema = z
  .object({
    preset: z.enum(["GOOGLE_NEWS", "GOOGLE_NEWS_SITE", "PASTE_URL"]),
    query: z.string().optional(),
    sourceSite: z.string().optional(),
    url: z.string().optional()
  })
  .superRefine((value, context) => {
    if (value.preset === "PASTE_URL") {
      if (!value.url?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "请输入要接入的链接。",
          path: ["url"]
        });
      }
      return;
    }

    if (!value.query?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "请输入要搜索的关键词。",
        path: ["query"]
      });
    }

    if (value.preset === "GOOGLE_NEWS_SITE" && !value.sourceSite?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "请输入指定数据源域名或站点。",
        path: ["sourceSite"]
      });
    }
  });
