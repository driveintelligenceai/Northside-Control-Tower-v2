import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const serviceLines = pgTable("service_lines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ServiceLine = typeof serviceLines.$inferSelect;
