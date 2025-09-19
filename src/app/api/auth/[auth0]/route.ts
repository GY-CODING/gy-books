import { auth0 } from '@/lib/auth0';

console.log(
  '🔧 Auth0 Route Handler - auth0 instance:',
  auth0 ? '✅ EXISTS' : '❌ NULL'
);
console.log(
  '🔧 Auth0 Route Handler - middleware function:',
  typeof auth0?.middleware
);

// En Auth0 v4, el middleware maneja todas las rutas automáticamente
export const GET = auth0.middleware;
export const POST = auth0.middleware;
