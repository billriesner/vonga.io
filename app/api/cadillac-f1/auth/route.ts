import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const CADILLAC_F1_PASSWORD = 'cadillacf1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password === CADILLAC_F1_PASSWORD) {
      // Set a secure cookie that expires in 7 days
      const cookieStore = await cookies();
      cookieStore.set('cadillac-f1-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/cadillac-f1',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('cadillac-f1-auth');
  
  return NextResponse.json({
    authenticated: authCookie?.value === 'authenticated',
  });
}

