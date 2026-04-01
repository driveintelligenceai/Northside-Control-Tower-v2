import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { alerts } from "@workspace/db/schema";
import { eq, desc, and, count, sql } from "drizzle-orm";
import {
  ListAlertsQueryParams,
  ListAlertsResponse,
  GetAlertsSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/alerts", async (req, res) => {
  const params = ListAlertsQueryParams.parse(req.query);
  const limit = params.limit || 50;

  const conditions = [];
  if (params.severity && params.severity !== "all") {
    conditions.push(eq(alerts.severity, params.severity));
  }
  if (params.acknowledged !== undefined) {
    conditions.push(eq(alerts.isAcknowledged, params.acknowledged));
  }

  const rows = await db
    .select()
    .from(alerts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(alerts.createdAt))
    .limit(limit);

  const result = rows.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    severity: row.severity,
    category: row.category,
    agentName: row.agentName ?? undefined,
    isAcknowledged: row.isAcknowledged,
    createdAt: row.createdAt.toISOString(),
  }));

  const data = ListAlertsResponse.parse(result);
  res.json(data);
});

router.get("/alerts/summary", async (_req, res) => {
  const [stats] = await db
    .select({
      total: count(),
      critical: sql<number>`count(*) filter (where ${alerts.severity} = 'critical')`,
      warning: sql<number>`count(*) filter (where ${alerts.severity} = 'warning')`,
      info: sql<number>`count(*) filter (where ${alerts.severity} = 'info')`,
      unacknowledged: sql<number>`count(*) filter (where ${alerts.isAcknowledged} = false)`,
    })
    .from(alerts);

  const data = GetAlertsSummaryResponse.parse({
    total: stats?.total ?? 0,
    critical: Number(stats?.critical ?? 0),
    warning: Number(stats?.warning ?? 0),
    info: Number(stats?.info ?? 0),
    unacknowledged: Number(stats?.unacknowledged ?? 0),
  });
  res.json(data);
});

export default router;
