import { NextResponse } from 'next/server';

export function middleware(req) {
  // Cek apakah browser membawa tanda pengenal (Cookie)
  const authCookie = req.cookies.get('flux_admin_session');
  
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isLoginRoute = req.nextUrl.pathname === '/login';

  // 1. Jika akses Dashboard tapi belum login -> Usir ke /login
  if (isDashboardRoute && !authCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Jika akses /login tapi SUDAH login -> Pindahkan ke Dashboard
  if (isLoginRoute && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Jika aman, biarkan lewat
  return NextResponse.next();
}

// Hanya pantau rute-rute ini agar website tidak lambat
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};