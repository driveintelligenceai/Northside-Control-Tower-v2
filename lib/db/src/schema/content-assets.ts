import { pgTable, serial, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { serviceLines } from "./service-lines";

export const contentAssets = pgTable("content_assets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  serviceLineId: integer("service_line_id").references(() => serviceLines.id),
  publishDate: timestamp("publish_date"),
  views: integer("views").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  conversions: integer("conversions").notNull().default(0),
  engagementRate: numeric("engagement_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ContentAsset = typeof contentAssets.$inferSelect;
