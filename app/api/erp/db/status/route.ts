import { NextResponse } from 'next/server';
import { checkDbConnection } from '@/lib/db';

export async function GET() {
  try {
    const status = await checkDbConnection();

    return NextResponse.json({
      success: true,
      mysql: {
        active: status.connected,
        host: status.config.host,
        port: status.config.port,
        database: status.config.database,
        error: status.error || null,
        schemaFile: 'database/schema.sql',
        environmentSource: '.env.example / .env.local',
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

