import { User } from '@/domain/user.model';

export async function getUser(): Promise<User> {
  try {
    const response = await fetch('/api/auth/get');

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    const user: User = data.gyCodingUser;
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}
