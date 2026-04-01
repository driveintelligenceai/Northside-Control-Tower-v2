import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { campaigns, serviceLines } from "@workspace/db/schema";
import { sql, eq, gte, and, desc } from "drizzle-orm";
import {
  ListCampaignsQueryParams,
  ListCampaignsResponse,
  GetCampaignParams,
  GetCampaignResponse,
  GetTopCampaignsQueryParams,
  GetTopCampaignsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getStartDate(period: string): Date {
  const d = new Date();
  const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "12m" ? 365 : 30;
  d.setDate(d.getDate() - days);
  return d;
}

router.get("/campaigns", async (req, res) => {
  const params = ListCampaignsQueryParams.parse(req.query);

  const conditions = [];
  if (params.status && params.status !== "all") {
    conditions.push(eq(campaigns.status, params.status));
  }
  if (params.type && params.type !== "all") {
    conditions.push(eq(campaigns.type, params.type));
  }

  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      type: campaigns.type,
      status: campaigns.status,
      serviceLineId: campaigns.serviceLineId,
      serviceLineName: serviceLines.name,
      startDate: campaigns.startDate,
      endDate: campaigns.endDate,
      budget: campaigns.budget,
      spent: campaigns.spent,
      impressions: campaigns.impressions,
      clicks: campaigns.clicks,
      conversions: campaigns.conversions,
    })
    .from(campaigns)
    .leftJoin(serviceLines, eq(campaigns.serviceLineId, serviceLines.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(campaigns.createdAt));

  const result = rows.map((row) => {
    const spent = Number(row.spent ?? 0);
    const clicks = row.clicks ?? 0;
    const impressions = row.impressions ?? 0;
    const conversions = row.conversions ?? 0;
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      status: row.status,
      serviceLineId: row.serviceLineId ?? undefined,
      serviceLineName: row.serviceLineName ?? undefined,
      startDate: row.startDate,
      endDate: row.endDate ?? undefined,
      budget: Number(row.budget),
      spent,
      impressions,
      clicks,
      conversions,
      ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
      cpc: clicks > 0 ? Math.round((spent / clicks) * 100) / 100 : 0,
      cpa: conversions > 0 ? Math.round((spent / conversions) * 100) / 100 : 0,
      roi: spent > 0 ? Math.round(((conversions * 1500 - spent) / spent) * 10000) / 100 : 0,
    };
  });

  const data = ListCampaignsResponse.parse(result);
  res.json(data);
});

router.get("/campaigns/top-performing", async (req, res) => {
  const params = GetTopCampaignsQueryParams.parse(req.query);
  const startDate = getStartDate(params.period || "30d");
  const limit = params.limit || 5;

  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      type: campaigns.type,
      spent: campaigns.spent,
      conversions: campaigns.conversions,
    })
    .from(campaigns)
    .where(gte(campaigns.createdAt, startDate))
    .orderBy(desc(campaigns.conversions))
    .limit(limit);

  const result = rows.map((row) => {
    const spent = Number(row.spent ?? 0);
    const conversions = row.conversions ?? 0;
    return {
      campaignId: row.id,
      campaignName: row.name,
      type: row.type,
      roi: spent > 0 ? Math.round(((conversions * 1500 - spent) / spent) * 10000) / 100 : 0,
      conversions,
      spent,
      cpa: conversions > 0 ? Math.round((spent / conversions) * 100) / 100 : 0,
    };
  });

  const data = GetTopCampaignsResponse.parse(result);
  res.json(data);
});

router.get("/campaigns/:id", async (req, res) => {
  const { id } = GetCampaignParams.parse(req.params);

  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      type: campaigns.type,
      status: campaigns.status,
      serviceLineId: campaigns.serviceLineId,
      serviceLineName: serviceLines.name,
      startDate: campaigns.startDate,
      endDate: campaigns.endDate,
      budget: campaigns.budget,
      spent: campaigns.spent,
      impressions: campaigns.impressions,
      clicks: campaigns.clicks,
      conversions: campaigns.conversions,
    })
    .from(campaigns)
    .leftJoin(serviceLines, eq(campaigns.serviceLineId, serviceLines.id))
    .where(eq(campaigns.id, id))
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }

  const row = rows[0];
  const spent = Number(row.spent ?? 0);
  const clicks = row.clicks ?? 0;
  const impressions = row.impressions ?? 0;
  const conversions = row.conversions ?? 0;

  const data = GetCampaignResponse.parse({
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    serviceLineId: row.serviceLineId ?? undefined,
    serviceLineName: row.serviceLineName ?? undefined,
    startDate: row.startDate,
    endDate: row.endDate ?? undefined,
    budget: Number(row.budget),
    spent,
    impressions,
    clicks,
    conversions,
    ctr: impressions > 0 ? Math.round((clicks / impressions) * 10000) / 100 : 0,
    cpc: clicks > 0 ? Math.round((spent / clicks) * 100) / 100 : 0,
    cpa: conversions > 0 ? Math.round((spent / conversions) * 100) / 100 : 0,
    roi: spent > 0 ? Math.round(((conversions * 1500 - spent) / spent) * 10000) / 100 : 0,
  });
  res.json(data);
});

export default router;
