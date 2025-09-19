import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log de rutas Auth0 para debugging
  if (pathname.startsWith('/auth/')) {
    console.log(`🔐 Auth0 Route: ${pathname}`);
    console.log(`🔐 Full URL: ${request.url}`);
  }

  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
