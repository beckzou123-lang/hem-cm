import type { SourceGrade, SourceType } from "@prisma/client";

export type LiveSourcePreset = "GOOGLE_NEWS" | "GOOGLE_NEWS_SITE" | "PASTE_URL";

export type SourceIntakeInput = {
  preset: LiveSourcePreset;
  query?: string;
  sourceSite?: string;
  url?: string;
  locale?: "zh-CN" | "en-US";
};

export type ExternalDocument = {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  sourceName: string;
  sourceType: SourceType;
  sourceGrade: SourceGrade;
  signalType: "NEWS" | "OFFICIAL" | "SPEECH" | "ANOMALY" | "MARKET" | "PHYSICAL";
  rawPayload: Record<string, unknown>;
};

type ParsedFeedItem = {
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  sourceName?: string;
};

function decodeHtml(input: string) {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function stripTags(input: string) {
  return decodeHtml(input)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? stripTags(match[1]) : "";
}

function extractMeta(html: string, name: string) {
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
  const match = html.match(pattern);
  return match ? decodeHtml(match[1]) : "";
}

function guessSourceClassification(hostname: string): {
  sourceType: SourceType;
  sourceGrade: SourceGrade;
  signalType: ExternalDocument["signalType"];
} {
  const host = hostname.toLowerCase();

  if (host.includes(".gov") || host.endsWith(".gov") || host.includes("gov.cn")) {
    return { sourceType: "GOVERNMENT", sourceGrade: "S", signalType: "OFFICIAL" };
  }

  if (host.includes("sec.gov") || host.includes("state.gov") || host.includes("whitehouse.gov") || host.includes("mofccom.gov.cn")) {
    return { sourceType: "GOVERNMENT", sourceGrade: "S", signalType: "OFFICIAL" };
  }

  if (host.includes("nasdaq") || host.includes("nyse") || host.includes("cmegroup") || host.includes("tradingeconomics")) {
    return { sourceType: "EXCHANGE", sourceGrade: "A", signalType: "MARKET" };
  }

  if (host.startsWith("ir.") || host.includes("investor") || host.includes("press.") || host.includes("newsroom")) {
    return { sourceType: "CORPORATE", sourceGrade: "A", signalType: "OFFICIAL" };
  }

  return { sourceType: "MEDIA", sourceGrade: "A", signalType: "NEWS" };
}

function normalizeSite(sourceSite?: string) {
  if (!sourceSite) return "";
  const value = sourceSite.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return new URL(value).hostname.replace(/^www\./, "");
  }
  return value.replace(/^www\./, "");
}

function buildGoogleNewsSearchUrl(query: string, sourceSite?: string, locale: SourceIntakeInput["locale"] = "en-US") {
  const normalizedSite = normalizeSite(sourceSite);
  const scopedQuery = normalizedSite ? `${query} site:${normalizedSite}` : query;
  const url = new URL("https://news.google.com/rss/search");
  url.searchParams.set("q", scopedQuery);
  if (locale === "zh-CN") {
    url.searchParams.set("hl", "zh-CN");
    url.searchParams.set("gl", "CN");
    url.searchParams.set("ceid", "CN:zh-Hans");
  } else {
    url.searchParams.set("hl", "en-US");
    url.searchParams.set("gl", "US");
    url.searchParams.set("ceid", "US:en");
  }
  return url.toString();
}

function parseRssOrAtom(xml: string, fallbackSourceName: string) {
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
  const entryBlocks = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)].map((match) => match[0]);
  const blocks = itemBlocks.length ? itemBlocks : entryBlocks;

  const docs: ParsedFeedItem[] = blocks.map((block) => {
    const title = extractTag(block, "title");
    const summary = extractTag(block, "description") || extractTag(block, "summary") || extractTag(block, "content");
    const guid = extractTag(block, "guid");
    const linkTag = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "";
    const atomHref = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] ?? "";
    const url = decodeHtml(atomHref || stripTags(linkTag) || guid);
    const publishedAt = extractTag(block, "pubDate") || extractTag(block, "published") || extractTag(block, "updated") || new Date().toISOString();
    const sourceName = extractTag(block, "source") || fallbackSourceName;

    return { title, summary, url, publishedAt, sourceName };
  });

  return docs.filter((item) => item.title && item.url);
}

function parseJsonPayload(payload: unknown, fallbackSourceName: string) {
  const buckets = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { items?: unknown[] })?.items)
      ? (payload as { items: unknown[] }).items
      : Array.isArray((payload as { entries?: unknown[] })?.entries)
        ? (payload as { entries: unknown[] }).entries
        : Array.isArray((payload as { articles?: unknown[] })?.articles)
          ? (payload as { articles: unknown[] }).articles
          : Array.isArray((payload as { data?: unknown[] })?.data)
            ? (payload as { data: unknown[] }).data
            : [];

  return buckets
    .map((item) => {
      const record = (item ?? {}) as Record<string, unknown>;
      const title = String(record.title ?? record.headline ?? record.name ?? "").trim();
      const summary = String(record.summary ?? record.description ?? record.snippet ?? "").trim();
      const url = String(record.url ?? record.link ?? record.id ?? "").trim();
      const publishedAt = String(record.publishedAt ?? record.pubDate ?? record.updatedAt ?? record.date ?? new Date().toISOString()).trim();
      const sourceName = String(record.source ?? record.sourceName ?? fallbackSourceName).trim();
      return { title, summary, url, publishedAt, sourceName };
    })
    .filter((item) => item.title && item.url);
}

function parseHtmlDocument(html: string, url: string, fallbackSourceName: string): ParsedFeedItem[] {
  const title = extractMeta(html, "og:title") || extractTag(html, "title");
  const summary =
    extractMeta(html, "description") ||
    extractMeta(html, "og:description") ||
    stripTags((html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? "").slice(0, 800));
  const publishedAt =
    extractMeta(html, "article:published_time") ||
    html.match(/<time[^>]+datetime=["']([^"']+)["']/i)?.[1] ||
    new Date().toISOString();

  return title ? [{ title, summary, url, publishedAt, sourceName: fallbackSourceName }] : [];
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "HEM-CM/1.0 (research terminal; +http://localhost:3010)"
    }
  });

  if (!response.ok) {
    throw new Error(`抓取失败：${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();
  return { contentType, text };
}

export async function fetchSourceDocuments(input: SourceIntakeInput) {
  const locale = input.locale ?? "en-US";
  let fetchUrl = "";
  let displaySourceName = locale === "zh-CN" ? "实时源" : "Live Source";

  if (input.preset === "PASTE_URL") {
    if (!input.url) {
      throw new Error(locale === "zh-CN" ? "请先粘贴有效链接。" : "Please paste a valid URL first.");
    }

    fetchUrl = input.url.trim();
    displaySourceName = normalizeSite(fetchUrl) || (locale === "zh-CN" ? "外部链接" : "External Link");
  } else {
    if (!input.query?.trim()) {
      throw new Error(locale === "zh-CN" ? "请输入要搜索的主题或关键词。" : "Please enter a topic or keyword to search.");
    }

    fetchUrl = buildGoogleNewsSearchUrl(input.query.trim(), input.preset === "GOOGLE_NEWS_SITE" ? input.sourceSite : undefined, locale);
    displaySourceName = input.preset === "GOOGLE_NEWS_SITE" ? `Google News / ${normalizeSite(input.sourceSite)}` : "Google News";
  }

  const { contentType, text } = await fetchText(fetchUrl);
  let parsedDocs: ParsedFeedItem[] = [];

  if (contentType.includes("xml") || contentType.includes("rss") || text.includes("<rss") || text.includes("<feed")) {
    parsedDocs = parseRssOrAtom(text, displaySourceName);
  } else if (contentType.includes("json")) {
    parsedDocs = parseJsonPayload(JSON.parse(text), displaySourceName);
  } else {
    parsedDocs = parseHtmlDocument(text, fetchUrl, displaySourceName);
  }

  if (!parsedDocs.length) {
    throw new Error(locale === "zh-CN" ? "已连接到该源，但暂时没有抽取到可分析的标题或摘要。" : "Connected to the source, but no analyzable titles or summaries were extracted.");
  }

  return parsedDocs.slice(0, 6).map((doc) => {
    const hostname = normalizeSite(doc.url || fetchUrl);
    const classification = guessSourceClassification(hostname || displaySourceName);

    return {
      title: doc.title,
      summary: doc.summary || (locale === "zh-CN" ? "外部源未提供摘要，系统使用标题和信源信息启动事件分析。" : "The external source did not provide a summary, so the system started analysis from the title and source metadata."),
      url: doc.url || fetchUrl,
      publishedAt: new Date(doc.publishedAt || Date.now()).toISOString(),
      sourceName: doc.sourceName || displaySourceName,
      sourceType: classification.sourceType,
      sourceGrade: classification.sourceGrade,
      signalType: classification.signalType,
      rawPayload: {
        fetchUrl,
        contentType,
        hostname,
        preset: input.preset
      }
    } satisfies ExternalDocument;
  });
}
