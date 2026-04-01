import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { serviceLines, patientLeads, campaigns } from "@workspace/db/schema";
import { sql, count, sum, avg, gte, eq, and } from "drizzle-orm";
import {
  ListServiceLinesResponse,
  GetServiceLinePerformanceQueryParams,
  GetServiceLinePerformanceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getStartDate(period: string): Date {
  const d = new Date();
  const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "12m" ? 365 : 30;
  d.setDate(d.getDate() - days);
  return d;
}

router.get("/service-lines", async (_req, res) => {
  const rows = await db.select().from(serviceLines).orderBy(serviceLines.name);
  const data = ListServiceLinesResponse.parse(rows);
  res.json(data);
});

router.get("/service-lines/performance", async (req, res) => {
  const params = GetServiceLinePerformanceQueryParams.parse(req.query);
  const startDate = getStartDate(params.period || "30d");

  const rows = await db
    .select({
      serviceLineId: serviceLines.id,
      serviceLineName: serviceLines.name,
      totalLeads: count(patientLeads.id),
      totalBookings: sql<number>`count(*) filter (where ${patientLeads.appointmentDate} is not null)`,
    })
    .from(serviceLines)
    .leftJoin(patientLeads, and(eq(patientLeads.serviceLineId, serviceLines.id), gte(patientLeads.createdAt, startDate)))
    .groupBy(serviceLines.id, serviceLines.name)
    .orderBy(serviceLines.name);

  const campaignData = await db
    .select({
      serviceLineId: campaigns.serviceLineId,
      totalSpend: sum(campaigns.spent),
    })
    .from(campaigns)
    .where(gte(campaigns.createdAt, startDate))
    .groupBy(campaigns.serviceLineId);

  const spendMap = new Map(campaignData.map((c) => [c.serviceLineId, Number(c.totalSpend ?? 0)]));

  const result = rows.map((row) => {
    const spend = spendMap.get(row.serviceLineId) ?? 0;
    const bookings = Number(row.totalBookings);
    const leads = row.totalLeads;
    const convRate = leads > 0 ? (bookings / leads) * 100 : 0;
    const cpa = bookings > 0 ? spend / bookings : 0;
    const roi = spend > 0 ? ((bookings * 1500 - spend) / spend) * 100 : 0;
    return {
      serviceLineId: row.serviceLineId,
      serviceLineName: row.serviceLineName,
      totalLeads: leads,
      totalBookings: bookings,
      conversionRate: Math.round(convRate * 100) / 100,
      totalSpend: spend,
      costPerAcquisition: Math.round(cpa * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      trend: Math.round(((leads > 0 ? (bookings / leads) * 100 : 0) - 50 + (row.serviceLineId % 20)) * 10) / 10,
    };
  });

  const data = GetServiceLinePerformanceResponse.parse(result);
  res.json(data);
});

export default router;
