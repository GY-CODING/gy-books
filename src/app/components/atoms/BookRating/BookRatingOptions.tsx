import React from 'react';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { EStatus } from '@/utils/constants/EStatus';

export interface StatusOption {
  label: string;
  value: EStatus;
  icon: JSX.Element;
}

export const statusOptions: StatusOption[] = [
  {
    label: 'Want to read',
    value: EStatus.WANT_TO_READ,
    icon: <BookmarkIcon />,
  },
  {
    label: 'Reading',
    value: EStatus.READING,
    icon: <RemoveRedEyeIcon />,
  },
  {
    label: 'Read',
    value: EStatus.READ,
    icon: <CheckCircleIcon />,
  },
];
