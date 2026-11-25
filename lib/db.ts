import mysql from 'mysql2/promise';

// Connection pool configuration from environment variables
const poolConfig: mysql.PoolOptions = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'contec_erp',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '5', 10),
  maxIdle: 3,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  queueLimit: 0,
  connectTimeout: 4000,
};

const globalForDb = globalThis as unknown as { __contecPool?: mysql.Pool };
let isConnected = false;
let lastCheckTime = 0;

export function getDbPool(): mysql.Pool {
  if (!globalForDb.__contecPool) {
    globalForDb.__contecPool = mysql.createPool(poolConfig);
  }
  return globalForDb.__contecPool;
}

/**
 * Check if MySQL server is reachable and active
 */
export async function checkDbConnection(): Promise<{ connected: boolean; error?: string; config: { host: string; port: number; database: string } }> {
  const now = Date.now();
  if (now - lastCheckTime < 10000 && isConnected) {
    return {
      connected: true,
      config: {
        host: poolConfig.host as string,
        port: poolConfig.port as number,
        database: poolConfig.database as string,
      },
    };
  }

  try {
    const activePool = getDbPool();
    const conn = await activePool.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    lastCheckTime = now;
    return {
      connected: true,
      config: {
        host: poolConfig.host as string,
        port: poolConfig.port as number,
        database: poolConfig.database as string,
      },
    };
  } catch (err: unknown) {
    isConnected = false;
    const msg = err instanceof Error ? err.message : 'Unknown MySQL connection failure';
    return {
      connected: false,
      error: msg,
      config: {
        host: poolConfig.host as string,
        port: poolConfig.port as number,
        database: poolConfig.database as string,
      },
    };
  }
}

/**
 * Execute a query with automatic fallback support
 */
export async function query<T = unknown>(sql: string, values?: unknown[]): Promise<T | null> {
  try {
    const activePool = getDbPool();
    const [rows] = await activePool.query(sql, values);
    return rows as T;
  } catch (error) {
    console.warn(`[CONTEC DB WARNING] MySQL execution bypassed or failed: ${(error as Error).message}`);
    return null;
  }
}

