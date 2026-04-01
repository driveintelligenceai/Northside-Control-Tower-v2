import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { agents, agentActivities } from "@workspace/db/schema";
import { eq, desc, avg, count, sum, sql } from "drizzle-orm";
import {
  ListAgentsResponse,
  GetAgentActivityParams,
  GetAgentActivityQueryParams,
  GetAgentActivityResponse,
  GetAgentHealthResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/agents", async (_req, res) => {
  const rows = await db.select().from(agents).orderBy(agents.name);

  const result = rows.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    accuracy: Number(row.accuracy),
    errorRate: Number(row.errorRate),
    confidenceScore: Number(row.confidenceScore),
    tasksCompleted: row.tasksCompleted,
    tasksTotal: row.tasksTotal,
    lastRunAt: row.lastRunAt?.toISOString() ?? new Date().toISOString(),
    learningRate: Number(row.learningRate),
    description: row.description ?? "",
  }));

  const data = ListAgentsResponse.parse(result);
  res.json(data);
});

router.get("/agents/health", async (_req, res) => {
  const [stats] = await db
    .select({
      totalAgents: count(),
      activeAgents: sql<number>`count(*) filter (where ${agents.status} = 'active')`,
      avgAccuracy: avg(agents.accuracy),
      avgErrorRate: avg(agents.errorRate),
      avgConfidence: avg(agents.confidenceScore),
      totalTasksCompleted: sum(agents.tasksCompleted),
    })
    .from(agents);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayTasks] = await db
    .select({ count: count() })
    .from(agentActivities)
    .where(sql`${agentActivities.timestamp} >= ${today}`);

  const data = GetAgentHealthResponse.parse({
    totalAgents: stats?.totalAgents ?? 0,
    activeAgents: Number(stats?.activeAgents ?? 0),
    avgAccuracy: Math.round(Number(stats?.avgAccuracy ?? 0) * 100) / 100,
    avgErrorRate: Math.round(Number(stats?.avgErrorRate ?? 0) * 100) / 100,
    avgConfidence: Math.round(Number(stats?.avgConfidence ?? 0) * 100) / 100,
    totalTasksCompleted: Number(stats?.totalTasksCompleted ?? 0),
    totalTasksToday: todayTasks?.count ?? 0,
    learningTrend: 2.3,
  });
  res.json(data);
});

router.get("/agents/:id/activity", async (req, res) => {
  const { id } = GetAgentActivityParams.parse(req.params);
  const params = GetAgentActivityQueryParams.parse(req.query);
  const limit = params.limit || 50;

  const rows = await db
    .select()
    .from(agentActivities)
    .where(eq(agentActivities.agentId, id))
    .orderBy(desc(agentActivities.timestamp))
    .limit(limit);

  const result = rows.map((row) => ({
    id: row.id,
    agentId: row.agentId,
    action: row.action,
    details: row.details ?? "",
    status: row.status,
    confidenceScore: row.confidenceScore ? Number(row.confidenceScore) : undefined,
    timestamp: row.timestamp.toISOString(),
  }));

  const data = GetAgentActivityResponse.parse(result);
  res.json(data);
});

export default router;
