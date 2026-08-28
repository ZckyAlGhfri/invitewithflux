import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from '@/lib/auth/session-token';

export async function proxy(request) {
  const sessionValue = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = Boolean(await verifyAdminSessionToken(sessionValue));
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isLoginRoute = request.nextUrl.pathname === '/login';

  if (isDashboardRoute && !authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isLoginRoute && authenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
