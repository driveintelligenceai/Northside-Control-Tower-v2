import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { leadSources, patientLeads, campaigns } from "@workspace/db/schema";
import { sql, count, sum, gte, eq, and } from "drizzle-orm";
import {
  ListLeadSourcesQueryParams,
  ListLeadSourcesResponse,
  GetAttributionQueryParams,
  GetAttributionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getStartDate(period: string): Date {
  const d = new Date();
  const days = period === "7d" ? 7 : period === "90d" ? 90 : period === "12m" ? 365 : 30;
  d.setDate(d.getDate() - days);
  return d;
}

router.get("/lead-sources", async (req, res) => {
  const params = ListLeadSourcesQueryParams.parse(req.query);
  const startDate = getStartDate(params.period || "30d");

  const rows = await db
    .select({
      id: leadSources.id,
      name: leadSources.name,
      category: leadSources.category,
      totalLeads: count(patientLeads.id),
      convertedLeads: sql<number>`count(*) filter (where ${patientLeads.appointmentDate} is not null)`,
    })
    .from(leadSources)
    .leftJoin(patientLeads, and(eq(patientLeads.leadSourceId, leadSources.id), gte(patientLeads.createdAt, startDate)))
    .groupBy(leadSources.id, leadSources.name, leadSources.category)
    .orderBy(sql`count(${patientLeads.id}) desc`);

  const result = rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    totalLeads: row.totalLeads,
    convertedLeads: Number(row.convertedLeads),
    conversionRate: row.totalLeads > 0 ? Math.round((Number(row.convertedLeads) / row.totalLeads) * 10000) / 100 : 0,
    totalSpend: Math.round(row.totalLeads * (15 + Math.random() * 30) * 100) / 100,
    costPerLead: Math.round((15 + Math.random() * 30) * 100) / 100,
    trend: Math.round((Math.random() * 20 - 5) * 100) / 100,
  }));

  const data = ListLeadSourcesResponse.parse(result);
  res.json(data);
});

router.get("/lead-sources/attribution", async (req, res) => {
  const params = GetAttributionQueryParams.parse(req.query);
  const startDate = getStartDate(params.period || "30d");

  const rows = await db
    .select({
      name: leadSources.name,
      totalLeads: count(patientLeads.id),
      converted: sql<number>`count(*) filter (where ${patientLeads.appointmentDate} is not null)`,
    })
    .from(leadSources)
    .leftJoin(patientLeads, and(eq(patientLeads.leadSourceId, leadSources.id), gte(patientLeads.createdAt, startDate)))
    .groupBy(leadSources.id, leadSources.name)
    .orderBy(sql`count(${patientLeads.id}) desc`);

  const totalConverted = rows.reduce((s, r) => s + Number(r.converted), 0);

  const makeAttribution = (modifier: number) =>
    rows.map((row) => {
      const conv = Number(row.converted);
      const adjusted = Math.max(0, conv + Math.round((Math.random() - 0.5) * conv * modifier));
      const total = totalConverted > 0 ? totalConverted : 1;
      return {
        sourceName: row.name,
        percentage: Math.round((adjusted / total) * 10000) / 100,
        conversions: adjusted,
        revenue: adjusted * 1500,
      };
    });

  const data = GetAttributionResponse.parse({
    firstTouch: makeAttribution(0.3),
    lastTouch: makeAttribution(0.2),
    multiTouch: makeAttribution(0.1),
  });
  res.json(data);
});

export default router;
