import { NextResponse } from 'next/server';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    adminSecretExists: !!process.env.ADMIN_SECRET,
    adminSecretLength: process.env.ADMIN_SECRET?.length || 0,
    // Don't return the actual secret in production, this is just for debugging
    adminSecretFirstChar: process.env.ADMIN_SECRET ? process.env.ADMIN_SECRET[0] : null,
    supabaseServiceKeyExists: !!process.env.SUPABASE_SERVICE_KEY,
    environment: process.env.NODE_ENV
  });
} 