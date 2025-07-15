/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers, cookies } from 'next/headers';
import { getSession } from '@auth0/nextjs-auth0';
import { User } from '@/domain/friend.model';

export default async function getAccountsUser(
  id: string
): Promise<User | null> {
  if (!id) throw new Error('No username provided in formData');

  const session = await getSession();
  const host = headers().get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

  const urlPrivate = `${protocol}://${host}/api/auth/accounts/${id}`;
  const urlPublic = `${protocol}://${host}/api/public/accounts/${id}`;

  // Si hay sesión, intenta privada primero
  if (session?.user) {
    try {
      const cookieHeader = cookies().toString();
      const privateRes = await fetch(urlPrivate, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        credentials: 'include',
        cache: 'no-store',
      });
      const privateText = await privateRes.clone().text();
      if (privateRes.ok) {
        return JSON.parse(privateText) as User;
      }
      // Si la privada no va, sigue a la pública
    } catch (error) {
      console.warn('[DEBUG] Error in private fetch:', error);
    }
  }

  // Si no hay sesión o la privada falla, intenta pública
  try {
    const publicRes = await fetch(urlPublic, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const publicText = await publicRes.clone().text();
    if (publicRes.ok) {
      return JSON.parse(publicText) as User;
    }
    console.warn('[DEBUG] Public fetch failed:', publicRes.status, publicText);
    return null;
  } catch (error) {
    console.warn('[DEBUG] Error in public fetch:', error);
    return null;
  }
}
