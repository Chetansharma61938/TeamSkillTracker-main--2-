import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { DATABASE_URL } from './config';

// Only use WebSocket in non-edge environment
if (!process.env.VERCEL_REGION?.includes('edge')) {
  neonConfig.webSocketConstructor = ws;
}

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set in environment variables. Check your Vercel project settings.",
  );
}

// Create a pool with keep-alive disabled for serverless
export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 1,
  keepAlive: false
});

export const db = drizzle({ client: pool, schema });

// Helper function to ensure connections are properly closed
export const closePool = async () => {
  await pool.end();
};
