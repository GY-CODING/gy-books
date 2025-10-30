/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers, cookies } from 'next/headers';

export default async function updateBiography(
  biography: string
): Promise<string> {
  if (!biography) throw new Error('No biography provided in formData');

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/profile/biography`;

  // --- DEBUG: Log info before private fetch ---

  let privateRes: Response;
  try {
    privateRes = await fetch(urlPrivate, {
      method: 'POST',
      body: JSON.stringify({ biography }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });
    const privateText = await privateRes.clone().text();

    if (privateRes.ok) {
      return privateText;
    }
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
    // Si es 401, sigue al endpoint público
    return privateText as string;
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
