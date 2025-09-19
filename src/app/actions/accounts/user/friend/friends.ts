/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Friend } from '@/domain/friend.model';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export default async function getFriends(): Promise<Friend[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await fetch(
      `${protocol}://${host}/api/auth/accounts/friends`,
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
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error('No ApiFriendRequest data received from server');
    }

    return data as Friend[];
  } catch (error: any) {
    throw new Error(`Failed to add friend: ${error.message}`);
  }
}
