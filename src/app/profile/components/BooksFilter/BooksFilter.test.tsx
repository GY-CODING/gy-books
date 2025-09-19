import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BooksFilter } from './BooksFilter';
import { EStatus } from '@/utils/constants/EStatus';

describe('BooksFilter', () => {
  const statusOptions = [
    { label: 'Reading', value: EStatus.READING },
    { label: 'Read', value: EStatus.READ },
    { label: 'Want to read', value: EStatus.WANT_TO_READ },
  ];
  const authorOptions = ['Author 1', 'Author 2'];
  const seriesOptions = ['Series 1', 'Series 2'];

  const defaultProps = {
    statusOptions,
    statusFilter: null,
    authorOptions,
    seriesOptions,
    authorFilter: '',
    seriesFilter: '',
    ratingFilter: 0,
    search: '',
    onStatusChange: jest.fn(),
    onAuthorChange: jest.fn(),
    onSeriesChange: jest.fn(),
    onRatingChange: jest.fn(),
    onSearchChange: jest.fn(),
    orderBy: 'title',
    orderDirection: 'asc' as const, // Explicitly type as 'asc'
    onOrderByChange: jest.fn(),
    onOrderDirectionChange: jest.fn(),
  };

  it('renders all filter selects', () => {
    render(<BooksFilter {...defaultProps} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Series')).toBeInTheDocument();
    // El input de búsqueda tiene 'Search books...' como placeholder y el select de rating tiene 'All' como opción principal
    expect(screen.getByPlaceholderText('Search books...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('renders status options', () => {
    render(<BooksFilter {...defaultProps} />);
    // Abre el select de status
    fireEvent.mouseDown(screen.getAllByRole('combobox')[1]);
    statusOptions.forEach((opt) => {
      const options = screen.getAllByRole('option');
      expect(
        options.some((option) => option.textContent?.includes(opt.label))
      ).toBe(true);
    });
  });
  it('renders author and series options', () => {
    render(<BooksFilter {...defaultProps} />);
    // Abre el select de author
    fireEvent.mouseDown(screen.getByText('Author'));
    authorOptions.forEach((author) => {
      expect(
        screen.getByRole('option', {
          name: (content) => content.includes(author),
        })
      ).toBeInTheDocument();
    });
    // Abre el select de series
    fireEvent.mouseDown(screen.getByText('Series'));
    seriesOptions.forEach((series) => {
      expect(
        screen.getByRole('option', {
          name: (content) => content.includes(series),
        })
      ).toBeInTheDocument();
    });
  });

  it('calls onStatusChange when status changes', () => {
    render(<BooksFilter {...defaultProps} />);
    fireEvent.mouseDown(screen.getByText('Status'));
    fireEvent.click(screen.getByText('Read'));
    expect(defaultProps.onStatusChange).toHaveBeenCalledWith(EStatus.READ);
  });

  it('calls onAuthorChange when author changes', () => {
    render(<BooksFilter {...defaultProps} />);
    fireEvent.mouseDown(screen.getByText('Author'));
    fireEvent.click(screen.getByText('Author 2'));
    expect(defaultProps.onAuthorChange).toHaveBeenCalledWith('Author 2');
  });

  it('calls onSeriesChange when series changes', () => {
    render(<BooksFilter {...defaultProps} />);
    fireEvent.mouseDown(screen.getByText('Series'));
    fireEvent.click(screen.getByText('Series 1'));
    expect(defaultProps.onSeriesChange).toHaveBeenCalledWith('Series 1');
  });

  it('calls onRatingChange when rating changes', () => {
    render(<BooksFilter {...defaultProps} />);
    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    fireEvent.click(
      screen.getByRole('option', { name: (content) => content.includes('★ 5') })
    );
    expect(defaultProps.onRatingChange).toHaveBeenCalledWith(5);
  });
});
