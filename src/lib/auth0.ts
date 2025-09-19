import { Auth0Client } from '@auth0/nextjs-auth0/server';
let auth0Client: Auth0Client;

try {
  auth0Client = new Auth0Client();
} catch (error) {
  throw error;
}

export const auth0 = auth0Client;
