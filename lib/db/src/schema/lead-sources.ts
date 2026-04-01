import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leadSources = pgTable("lead_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type LeadSource = typeof leadSources.$inferSelect;
