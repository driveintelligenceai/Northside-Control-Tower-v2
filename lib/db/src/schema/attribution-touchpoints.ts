import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { patientLeads } from "./patient-leads";
import { leadSources } from "./lead-sources";
import { campaigns } from "./campaigns";

export const attributionTouchpoints = pgTable("attribution_touchpoints", {
  id: serial("id").primaryKey(),
  patientLeadId: integer("patient_lead_id").notNull().references(() => patientLeads.id),
  leadSourceId: integer("lead_source_id").references(() => leadSources.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  touchpointType: text("touchpoint_type").notNull().default("click"),
  channel: text("channel").notNull(),
  position: integer("position").notNull().default(1),
  interactionDate: timestamp("interaction_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AttributionTouchpoint = typeof attributionTouchpoints.$inferSelect;
