import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { serviceLines } from "./service-lines";
import { leadSources } from "./lead-sources";
import { campaigns } from "./campaigns";

export const patientLeads = pgTable("patient_leads", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull(),
  serviceLineId: integer("service_line_id").references(() => serviceLines.id),
  leadSourceId: integer("lead_source_id").references(() => leadSources.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  status: text("status").notNull().default("new"),
  isNewPatient: boolean("is_new_patient").notNull().default(true),
  appointmentDate: timestamp("appointment_date"),
  completedDate: timestamp("completed_date"),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type PatientLead = typeof patientLeads.$inferSelect;
