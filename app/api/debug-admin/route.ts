import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET || '';
    
    return NextResponse.json({
      passwordProvided: password,
      adminSecretLength: adminSecret.length,
      adminSecretFirst3Chars: adminSecret.substring(0, 3),
      match: password === adminSecret,
      // For debugging only - don't include this in production
      passwordWithQuotes: `"${password}"`,
      adminSecretWithQuotes: `"${adminSecret}"`,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
} 