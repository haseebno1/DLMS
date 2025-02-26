import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminSecret = process.env.ADMIN_SECRET || '';
    
    // Check if credentials match admin credentials
    if (email === adminEmail && password === adminSecret) {
      // Generate a random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiry time (24 hours from now)
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 24);
      
      return NextResponse.json({
        success: true,
        isAdmin: true,
        token,
        expiry: expiry.toISOString(),
        message: 'Admin authentication successful',
      });
    } 
    
    // TODO: Implement regular user authentication here when needed
    // For now, just return unauthorized
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 