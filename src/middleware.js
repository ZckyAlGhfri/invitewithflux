import { NextResponse } from 'next/server';

export function middleware(req) {
  // Cegat semua akses ke /dashboard dan anak-anaknya
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    
    const authHeader = req.headers.get('authorization');

    if (authHeader) {
      const authValue = authHeader.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === 'zkyyy' && pwd === 'flux2026') {
        return NextResponse.next(); // Gembok terbuka
      }
    }

    // Gembok terkunci, paksa munculkan pop-up
    return new NextResponse('Akses Ditolak. Area Khusus Admin.', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Admin Area"' },
    });
  }
  
  return NextResponse.next();
}

// Menangkap /dashboard dan /dashboard/edit/...
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};