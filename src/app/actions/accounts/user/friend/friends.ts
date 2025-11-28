/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Profile } from '@gycoding/nebula';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function getFriends(): Promise<Profile[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await fetch(
      `${protocol}://${host}/api/auth/books/friends`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch friends: ${response.status} - ${errorText}`);
      return []; // Devolver array vacío en lugar de lanzar error
    }

    const data = await response.json();

    if (!data) {
      console.error('No friend data received from server');
      return [];
    }

    return data as Profile[];
  } catch (error: any) {
    console.error(`Failed to fetch friends: ${error.message}`);
    return []; // Devolver array vacío en lugar de lanzar error
  }
}
