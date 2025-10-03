import { EStatus } from '@/utils/constants/EStatus';

export interface UserData {
  userId: string;
  status: EStatus;
  rating: number;
  startDate: string;
  endDate: string;
  progress?: number;
  editionId?: string;
}

export function formatProgress(progress: number) {
  if (progress <= 0) {
    return '0';
  }
  if (progress <= 1) {
    return progress * 100;
  }
  return progress;
}

export function formatPercent(progress: number) {
  return (progress / 100) as unknown as number;
}
