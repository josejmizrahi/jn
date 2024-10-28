import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  const protectedRoutes = ['/feed', '/profile', '/torah-study', '/community', '/governance', '/economy', '/settings'];
  
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  // Auth page redirect if user is already logged in
  if (req.nextUrl.pathname === '/auth') {
    if (session) {
      return NextResponse.redirect(new URL('/feed', req.url));
    }
  }

  // Redirect to feed after login
  if (session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/feed', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/auth', '/feed/:path*', '/profile/:path*', '/torah-study/:path*', '/community/:path*', '/governance/:path*', '/economy/:path*', '/settings/:path*'],
};