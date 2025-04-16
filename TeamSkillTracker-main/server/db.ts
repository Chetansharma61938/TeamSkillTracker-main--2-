import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "../shared/schema";
import { DATABASE_URL } from './config';

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set in environment variables. Check your Vercel project settings.",
  );
}

// Create a pool with optimized settings
export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 1,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });

// Helper function to ensure connections are properly closed
export const closePool = async () => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing pool:', error);
  }
};
