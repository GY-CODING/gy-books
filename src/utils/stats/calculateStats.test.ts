import {
  calculateStats,
  sortAuthorsByCount,
  getTopAuthors,
} from './calculateStats';
import type HardcoverBook from '@/domain/HardcoverBook';

describe('calculateStats', () => {
  it('should return empty stats for empty array', () => {
    const result = calculateStats([]);
    expect(result.totalBooks).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.ratings.averageRating).toBe(0);
  });

  it('should calculate total books correctly', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        pageCount: 300,
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        pageCount: 200,
        userData: { status: 'READING', rating: 0 },
        author: { name: 'Author A' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.totalBooks).toBe(2);
  });

  it('should calculate total pages for READ and READING books only', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        pageCount: 300,
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        pageCount: 200,
        userData: { status: 'READING', rating: 0 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '3',
        title: 'Book 3',
        pageCount: 400,
        userData: { status: 'WANT_TO_READ', rating: 0 },
        author: { name: 'Author B' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.totalPages).toBe(500); // 300 + 200, NOT 400
    expect(result.wantToReadPages).toBe(400);
  });

  it('should count authors correctly', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        pageCount: 300,
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Brandon Sanderson' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        pageCount: 200,
        userData: { status: 'READ', rating: 4 },
        author: { name: 'Brandon Sanderson' },
      } as HardcoverBook,
      {
        id: '3',
        title: 'Book 3',
        pageCount: 400,
        userData: { status: 'READ', rating: 3 },
        author: { name: 'Tolkien' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.authors['Brandon Sanderson']).toBe(2);
    expect(result.authors['Tolkien']).toBe(1);
  });

  it('should count book statuses correctly', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        userData: { status: 'READ', rating: 4 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '3',
        title: 'Book 3',
        userData: { status: 'READING', rating: 0 },
        author: { name: 'Author B' },
      } as HardcoverBook,
      {
        id: '4',
        title: 'Book 4',
        userData: { status: 'WANT_TO_READ', rating: 0 },
        author: { name: 'Author C' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.bookStatus['READ']).toBe(2);
    expect(result.bookStatus['READING']).toBe(1);
    expect(result.bookStatus['WANT_TO_READ']).toBe(1);
  });

  it('should calculate rating distribution correctly', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '3',
        title: 'Book 3',
        userData: { status: 'READ', rating: 4 },
        author: { name: 'Author B' },
      } as HardcoverBook,
      {
        id: '4',
        title: 'Book 4',
        userData: { status: 'READ', rating: 3.5 },
        author: { name: 'Author C' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.ratings.distribution['5']).toBe(2);
    expect(result.ratings.distribution['4']).toBe(1);
    expect(result.ratings.distribution['3.5']).toBe(1);
  });

  it('should calculate average rating correctly', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        userData: { status: 'READ', rating: 3 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '3',
        title: 'Book 3',
        userData: { status: 'READ', rating: 4 },
        author: { name: 'Author B' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    // (5 + 3 + 4) / 3 = 4
    expect(result.ratings.averageRating).toBe(4);
    expect(result.ratings.totalRatedBooks).toBe(3);
  });

  it('should ignore books with rating 0', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        userData: { status: 'READING', rating: 0 },
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '3',
        title: 'Book 3',
        userData: { status: 'WANT_TO_READ', rating: 0 },
        author: { name: 'Author B' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.ratings.averageRating).toBe(5);
    expect(result.ratings.totalRatedBooks).toBe(1);
  });

  it('should skip books without userData', () => {
    const books: HardcoverBook[] = [
      {
        id: '1',
        title: 'Book 1',
        pageCount: 300,
        author: { name: 'Author A' },
      } as HardcoverBook,
      {
        id: '2',
        title: 'Book 2',
        pageCount: 200,
        userData: { status: 'READ', rating: 5 },
        author: { name: 'Author B' },
      } as HardcoverBook,
    ];

    const result = calculateStats(books);
    expect(result.totalBooks).toBe(1); // Only Book 2 counts
  });
});

describe('sortAuthorsByCount', () => {
  it('should sort authors by count descending', () => {
    const authors = {
      'Author A': 5,
      'Author B': 10,
      'Author C': 3,
    };

    const sorted = sortAuthorsByCount(authors);
    expect(sorted).toEqual([
      ['Author B', 10],
      ['Author A', 5],
      ['Author C', 3],
    ]);
  });
});

describe('getTopAuthors', () => {
  it('should return top N authors', () => {
    const authors = {
      'Author A': 5,
      'Author B': 10,
      'Author C': 3,
      'Author D': 8,
      'Author E': 2,
    };

    const top3 = getTopAuthors(authors, 3);
    expect(top3).toHaveLength(3);
    expect(top3[0]).toEqual(['Author B', 10]);
    expect(top3[1]).toEqual(['Author D', 8]);
    expect(top3[2]).toEqual(['Author A', 5]);
  });

  it('should return all authors if limit exceeds count', () => {
    const authors = {
      'Author A': 5,
      'Author B': 10,
    };

    const top10 = getTopAuthors(authors, 10);
    expect(top10).toHaveLength(2);
  });
});
