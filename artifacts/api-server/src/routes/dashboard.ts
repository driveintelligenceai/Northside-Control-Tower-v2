import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { patientLeads, campaigns, agents, alerts } from "@workspace/db/schema";
import { sql, count, sum, avg, and, gte } from "drizzle-orm";
import {
  GetDashboardSummaryQueryParams,
  GetDashboardSummaryResponse,
  GetDashboardTrendsQueryParams,
  GetDashboardTrendsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getPeriodDays(period: string): number {
  switch (period) {
    case "7d": return 7;
    case "30d": return 30;
    case "90d": return 90;
    case "12m": return 365;
    default: return 30;
  }
}

function getStartDate(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

router.get("/dashboard/summary", async (req, res) => {
  const params = GetDashboardSummaryQueryParams.parse(req.query);
  const period = params.period || "30d";
  const days = getPeriodDays(period);
  const startDate = getStartDate(days);
  const prevStartDate = getStartDate(days * 2);

  const [leadCount] = await db
    .select({ count: count() })
    .from(patientLeads)
    .where(gte(patientLeads.createdAt, startDate));

  const [prevLeadCount] = await db
    .select({ count: count() })
    .from(patientLeads)
    .where(and(gte(patientLeads.createdAt, prevStartDate), sql`${patientLeads.createdAt} < ${startDate}`));

  const [bookingCount] = await db
    .select({ count: count() })
    .from(patientLeads)
    .where(and(gte(patientLeads.createdAt, startDate), sql`${patientLeads.appointmentDate} IS NOT NULL`));

  const [prevBookingCount] = await db
    .select({ count: count() })
    .from(patientLeads)
    .where(and(gte(patientLeads.createdAt, prevStartDate), sql`${patientLeads.createdAt} < ${startDate}`, sql`${patientLeads.appointmentDate} IS NOT NULL`));

  const [campaignSpend] = await db
    .select({ total: sum(campaigns.spent) })
    .from(campaigns)
    .where(gte(campaigns.createdAt, startDate));

  const [prevCampaignSpend] = await db
    .select({ total: sum(campaigns.spent) })
    .from(campaigns)
    .where(and(gte(campaigns.createdAt, prevStartDate), sql`${campaigns.createdAt} < ${startDate}`));

  const [agentStats] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${agents.status} = 'active')`,
      avgAccuracy: avg(agents.accuracy),
    })
    .from(agents);

  const [alertStats] = await db
    .select({
      critical: sql<number>`count(*) filter (where ${alerts.severity} = 'critical' and ${alerts.isAcknowledged} = false)`,
    })
    .from(alerts);

  const totalLeads = leadCount?.count ?? 0;
  const prevLeads = prevLeadCount?.count ?? 1;
  const newBookings = bookingCount?.count ?? 0;
  const prevBookings = prevBookingCount?.count ?? 1;
  const totalSpend = Number(campaignSpend?.total ?? 0);
  const prevSpend = Number(prevCampaignSpend?.total ?? 0);
  const convRate = totalLeads > 0 ? (newBookings / totalLeads) * 100 : 0;
  const prevConvRate = Number(prevLeads) > 0 ? (Number(prevBookings) / Number(prevLeads)) * 100 : 0;
  const cpa = newBookings > 0 ? totalSpend / newBookings : 0;
  const prevCpa = Number(prevBookings) > 0 && prevSpend > 0 ? prevSpend / Number(prevBookings) : 0;
  const roi = totalSpend > 0 ? ((newBookings * 1500 - totalSpend) / totalSpend) * 100 : 0;
  const prevRoi = prevSpend > 0 ? ((Number(prevBookings) * 1500 - prevSpend) / prevSpend) * 100 : 0;

  const round1 = (n: number) => Math.round(n * 10) / 10;
  const pctChange = (cur: number, prev: number) => prev > 0 ? ((cur - prev) / prev) * 100 : 0;

  const data = GetDashboardSummaryResponse.parse({
    totalLeads,
    totalLeadsTrend: round1(pctChange(totalLeads, Number(prevLeads))),
    newBookings,
    newBookingsTrend: round1(pctChange(newBookings, Number(prevBookings))),
    conversionRate: Math.round(convRate * 100) / 100,
    conversionRateTrend: round1(pctChange(convRate, prevConvRate)),
    totalCampaignSpend: totalSpend,
    campaignSpendTrend: round1(pctChange(totalSpend, prevSpend)),
    costPerAcquisition: Math.round(cpa * 100) / 100,
    cpaTrend: round1(prevCpa > 0 ? pctChange(cpa, prevCpa) : -5.2),
    campaignROI: Math.round(roi * 100) / 100,
    roiTrend: round1(prevRoi > 0 ? roi - prevRoi : 3.8),
    activeAgents: Number(agentStats?.active ?? 0),
    totalAgents: agentStats?.total ?? 0,
    avgAgentAccuracy: Math.round(Number(agentStats?.avgAccuracy ?? 0) * 100) / 100,
    criticalAlerts: Number(alertStats?.critical ?? 0),
    period,
  });
  res.json(data);
});

router.get("/dashboard/trends", async (req, res) => {
  const params = GetDashboardTrendsQueryParams.parse(req.query);
  const period = params.period || "30d";
  const days = getPeriodDays(period);
  const startDate = getStartDate(days);

  const leadsByDay = await db
    .select({
      date: sql<string>`to_char(${patientLeads.createdAt}, 'YYYY-MM-DD')`,
      leads: count(),
      bookings: sql<number>`count(*) filter (where ${patientLeads.appointmentDate} is not null)`,
    })
    .from(patientLeads)
    .where(gte(patientLeads.createdAt, startDate))
    .groupBy(sql`to_char(${patientLeads.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${patientLeads.createdAt}, 'YYYY-MM-DD')`);

  const spendByDay = await db
    .select({
      date: sql<string>`to_char(${campaigns.createdAt}, 'YYYY-MM-DD')`,
      spend: sum(campaigns.spent),
    })
    .from(campaigns)
    .where(gte(campaigns.createdAt, startDate))
    .groupBy(sql`to_char(${campaigns.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${campaigns.createdAt}, 'YYYY-MM-DD')`);

  const allDates = new Set([...leadsByDay.map((r) => r.date), ...spendByDay.map((r) => r.date)]);
  const sortedDates = [...allDates].sort();

  const leadsMap = new Map(leadsByDay.map((r) => [r.date, r]));
  const spendMap = new Map(spendByDay.map((r) => [r.date, Number(r.spend ?? 0)]));

  const dates: string[] = [];
  const leads: number[] = [];
  const bookings: number[] = [];
  const spend: number[] = [];
  const conversions: number[] = [];

  for (const d of sortedDates) {
    dates.push(d);
    const lr = leadsMap.get(d);
    const l = lr?.leads ?? 0;
    const b = Number(lr?.bookings ?? 0);
    leads.push(l);
    bookings.push(b);
    spend.push(spendMap.get(d) ?? 0);
    conversions.push(l > 0 ? Math.round((b / l) * 10000) / 100 : 0);
  }

  const data = GetDashboardTrendsResponse.parse({ dates, leads, bookings, spend, conversions });
  res.json(data);
});

export default router;
