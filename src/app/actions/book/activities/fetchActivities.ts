/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers } from 'next/headers';
import { UUID } from 'crypto';
import { Activity } from '@/domain/activity.model';

// Nueva función para traer todos los libros con paginación
export async function fetchActivities(profileId: UUID): Promise<Activity[]> {
  try {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const url = `${protocol}://${host}/api/public/books/activities?userId=${profileId}`;
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Action - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Activity[] = await response.json();

    return data;
  } catch (error: any) {
    console.error('Server Action - Error details:', error);
    throw new Error(`Failed to get books: ${error.message}`);
  }
}
