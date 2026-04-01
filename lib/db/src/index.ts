import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let databaseUrl = process.env.DATABASE_URL || process.env.DATABASE_POSTGRES_URL_NON_POOLING || process.env.DATABASE_POSTGRES_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isLocal = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");

if (!isLocal) {
  // Strip any sslmode from the URL and replace with no-verify to avoid cert chain issues
  const url = new URL(databaseUrl);
  url.searchParams.delete("sslmode");
  url.searchParams.set("sslmode", "no-verify");
  databaseUrl = url.toString();
}

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 1,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
