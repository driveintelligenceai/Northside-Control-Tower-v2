import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(),
  category: text("category").notNull(),
  agentName: text("agent_name"),
  isAcknowledged: boolean("is_acknowledged").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Alert = typeof alerts.$inferSelect;
