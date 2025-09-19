/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers, cookies } from 'next/headers';
import { User } from '@/domain/friend.model';

export default async function queryUsers(formData: FormData): Promise<User[]> {
  const query = formData.get('username');
  if (!query) throw new Error('No username provided in formData');

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/accounts?query=${query}`;
  const urlPublic = `${protocol}://${host}/api/public/accounts?query=${query}`;

  // --- DEBUG: Log info before private fetch ---

  let privateRes;
  try {
    privateRes = await fetch(urlPrivate, {
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
      return JSON.parse(privateText) as User[];
    }
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
  }

  // --- DEBUG: Log info before public fetch --

  const publicRes = await fetch(urlPublic, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const publicText = await publicRes.clone().text();

  if (publicRes.ok) {
    return JSON.parse(publicText) as User[];
  }

  throw new Error(
    `Public fetch failed. Status: ${publicRes.status} - ${publicText}`
  );
}
