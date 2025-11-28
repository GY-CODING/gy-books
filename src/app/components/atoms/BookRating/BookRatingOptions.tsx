import { EBookStatus } from '@gycoding/nebula';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

export interface StatusOption {
  label: string;
  value: EBookStatus;
  icon: JSX.Element;
}

export const statusOptions: StatusOption[] = [
  {
    label: 'Want to read',
    value: EBookStatus.WANT_TO_READ,
    icon: <BookmarkIcon />,
  },
  {
    label: 'Reading',
    value: EBookStatus.READING,
    icon: <RemoveRedEyeIcon />,
  },
  {
    label: 'Read',
    value: EBookStatus.READ,
    icon: <CheckCircleIcon />,
  },
];
