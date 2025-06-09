/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/logHelper.ts
import { ELevel } from '../constants/ELevel';

export async function sendLog(level: ELevel, message: string, data?: any) {
  try {
    const response = await fetch(
      'https://s1200613.eu-nbg-2.betterstackdata.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.LOGS_AUTH_TOKEN || '',
        },
        body: JSON.stringify({
          level,
          message,
          data,
        }),
      }
    );

    if (!response.ok) {
      console.error('Failed to send log:', response.statusText);
    }
  } catch (error) {
    console.error('Error while sending log:', error);
  }
}
