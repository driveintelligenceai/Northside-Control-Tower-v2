import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contentAssets, serviceLines } from "@workspace/db/schema";
import { sql, eq, gte, desc } from "drizzle-orm";
import {
  ListContentQueryParams,
  ListContentResponse,
  GetTopContentQueryParams,
  GetTopContentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getStartDate(period: string): Date {
  const d = new Date();
  const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "12m" ? 365 : 30;
  d.setDate(d.getDate() - days);
  return d;
}

router.get("/content", async (req, res) => {
  const params = ListContentQueryParams.parse(req.query);

  const conditions = [];
  if (params.type && params.type !== "all") {
    conditions.push(eq(contentAssets.type, params.type));
  }

  const rows = await db
    .select({
      id: contentAssets.id,
      title: contentAssets.title,
      type: contentAssets.type,
      serviceLineName: serviceLines.name,
      publishDate: contentAssets.publishDate,
      views: contentAssets.views,
      clicks: contentAssets.clicks,
      conversions: contentAssets.conversions,
      engagementRate: contentAssets.engagementRate,
      status: contentAssets.status,
    })
    .from(contentAssets)
    .leftJoin(serviceLines, eq(contentAssets.serviceLineId, serviceLines.id))
    .where(conditions.length > 0 ? conditions[0] : undefined)
    .orderBy(desc(contentAssets.views));

  const result = rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    serviceLineName: row.serviceLineName ?? "General",
    publishDate: row.publishDate?.toISOString() ?? "",
    views: row.views,
    clicks: row.clicks,
    conversions: row.conversions,
    engagementRate: Number(row.engagementRate),
    status: row.status,
  }));

  const data = ListContentResponse.parse(result);
  res.json(data);
});

router.get("/content/top-performing", async (req, res) => {
  const params = GetTopContentQueryParams.parse(req.query);
  const startDate = getStartDate(params.period || "30d");
  const limit = params.limit || 10;

  const rows = await db
    .select({
      id: contentAssets.id,
      title: contentAssets.title,
      type: contentAssets.type,
      views: contentAssets.views,
      clicks: contentAssets.clicks,
      conversions: contentAssets.conversions,
      engagementRate: contentAssets.engagementRate,
    })
    .from(contentAssets)
    .where(gte(contentAssets.publishDate, startDate))
    .orderBy(desc(contentAssets.conversions))
    .limit(limit);

  const result = rows.map((row) => ({
    contentId: row.id,
    title: row.title,
    type: row.type,
    views: row.views,
    conversions: row.conversions,
    engagementRate: Number(row.engagementRate),
    conversionRate: row.views > 0 ? Math.round((row.conversions / row.views) * 10000) / 100 : 0,
  }));

  const data = GetTopContentResponse.parse(result);
  res.json(data);
});

export default router;
