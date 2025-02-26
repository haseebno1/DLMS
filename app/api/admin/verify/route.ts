import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

// Get admin secret from environment variable
const adminSecret = process.env.ADMIN_SECRET || '';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Check if password matches admin secret
    if (password === adminSecret) {
      // Generate a random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiry time (24 hours from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      
      return NextResponse.json({
        success: true,
        token,
        expiry: expiry.toISOString(),
        message: 'Admin authentication successful',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 