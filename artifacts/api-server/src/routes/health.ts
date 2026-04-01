import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { agents } from "@workspace/db/schema";
import { count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/db-test", async (_req, res) => {
  try {
    const [result] = await db.select({ count: count() }).from(agents);
    res.json({ ok: true, agentCount: result?.count ?? 0 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const cause = err instanceof Error && err.cause instanceof Error ? err.cause.message : undefined;
    const stack = err instanceof Error ? err.stack?.split("\n").slice(0, 5) : undefined;
    res.status(500).json({ ok: false, error: message, cause, stack, envKeys: Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("POSTGRES")).sort() });
  }
});

export default router;
