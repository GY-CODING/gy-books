/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers, cookies } from 'next/headers';

export default async function updateBiography(
  biography: string
): Promise<string> {
  console.log('biography', biography);
  if (!biography) throw new Error('No biography provided in formData');

  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/books/biography`;

  // --- DEBUG: Log info before private fetch ---
  console.log('[DEBUG] Private fetch URL:', urlPrivate);

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
    console.log('[DEBUG] Private fetch status:', privateRes.status);
    const privateText = await privateRes.clone().text();
    console.log('[DEBUG] Private fetch body:', privateText);

    if (privateRes.ok) {
      return privateText;
    }
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
    // Si es 401, sigue al endpoint público
    console.log(
      '[DEBUG] Private fetch returned 401. Trying public endpoint...'
    );
    return privateText as string;
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
    throw error;
  }
}
