import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("active"),
  accuracy: numeric("accuracy", { precision: 5, scale: 2 }).notNull().default("0"),
  errorRate: numeric("error_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }).notNull().default("0"),
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  tasksTotal: integer("tasks_total").notNull().default(0),
  lastRunAt: timestamp("last_run_at"),
  learningRate: numeric("learning_rate", { precision: 5, scale: 4 }).notNull().default("0"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agentActivities = pgTable("agent_activities", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  action: text("action").notNull(),
  details: text("details"),
  status: text("status").notNull(),
  confidenceScore: numeric("confidence_score", { precision: 5, scale: 2 }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export type Agent = typeof agents.$inferSelect;
export type AgentActivity = typeof agentActivities.$inferSelect;
