import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const auditTrail = pgTable("audit_trail", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  userId: text("user_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AuditEntry = typeof auditTrail.$inferSelect;
