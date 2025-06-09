import { NextRequest, NextResponse } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = ['/profile', '/settings', '/dashboard'];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Si la ruta está en la lista de protegidas, redirige al login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const url = new URL('/api/auth/login', req.url);
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  // Para el resto de rutas, permite el acceso sin autenticación
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|api/public|api/books|_next/static|_next/image|gy-logo.ico).*)',
  ],
};
