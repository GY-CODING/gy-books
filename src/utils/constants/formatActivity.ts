import HardcoverBook from '@/domain/HardcoverBook';

export default function formatActivity(
  activity: EActivity,
  username: string,
  book: HardcoverBook,
  progress?: number,
  rating?: number
): string {
  const formatProgress =
    progress! <= 1 ? `${progress! * 100}%` : `${progress} pages`;

  const activityMap: Record<EActivity, string> = {
    [EActivity.BOOK_STARED_READING]: `[${book.id}] ${username} has started reading "${book.title}" by ${book.author.name}.`,
    [EActivity.BOOK_PROGRESS]: `[${book.id}] ${username} has made progress (${formatProgress}) on "${book.title}" by ${book.author.name}.`,
    [EActivity.BOOK_READ]: `[${book.id}] ${username} has finished reading "${book.title}" by ${book.author.name}.`,
    [EActivity.BOOK_RATED]: `[${book.id}] ${username} has given a rating of ${rating} stars to "${book.title}" by ${book.author.name}.`,
    [EActivity.BOOK_WANT_TO_READ]: `[${book.id}] ${username} has added "${book.title}" by ${book.author.name} to their want to read list.`,
  };

  return activityMap[activity] || 'Unknown activity';
}

export enum EActivity {
  BOOK_STARED_READING = 'book.startedReading',
  BOOK_PROGRESS = 'book.progress',
  BOOK_READ = 'book.read',
  BOOK_RATED = 'book.rated',
  BOOK_WANT_TO_READ = 'book.wantToRead',
}
