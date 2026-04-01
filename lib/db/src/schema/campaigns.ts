import { pgTable, serial, text, integer, numeric, timestamp, date } from "drizzle-orm/pg-core";
import { serviceLines } from "./service-lines";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("active"),
  serviceLineId: integer("service_line_id").references(() => serviceLines.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  budget: numeric("budget", { precision: 12, scale: 2 }).notNull(),
  spent: numeric("spent", { precision: 12, scale: 2 }).notNull().default("0"),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Campaign = typeof campaigns.$inferSelect;
