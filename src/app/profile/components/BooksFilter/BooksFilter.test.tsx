/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BooksFilter } from './BooksFilter';
import { EStatus } from '@/utils/constants/EStatus';

// Mock goudi font
jest.mock('@/utils/fonts/fonts', () => ({
  goudi: { style: { fontFamily: 'GoudiFont' } },
}));

// Mock useTheme and useMediaQuery
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    breakpoints: {
      down: (key: string) => (key === 'sm' ? '@media (max-width:600px)' : ''),
    },
  }),
}));
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: jest.fn(),
  };
});

const statusOptions = [
  { label: 'READING', value: EStatus.READING },
  { label: 'READ', value: EStatus.READ },
];

describe('BooksFilter', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Select on mobile', () => {
    require('@mui/material').useMediaQuery.mockReturnValue(true);

    render(
      <BooksFilter
        filterValue="all"
        statusOptions={statusOptions}
        statusFilter={null}
        onChange={onChange}
      />
    );

    // MUI Select renders as a combobox in the DOM
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    // Open select to assert the menu items are rendered
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.getByText(statusOptions[0].label)).toBeInTheDocument();
    expect(screen.getByText(statusOptions[1].label)).toBeInTheDocument();
  });

  it('renders RadioGroup on desktop', () => {
    require('@mui/material').useMediaQuery.mockReturnValue(false);

    render(
      <BooksFilter
        filterValue="all"
        statusOptions={statusOptions}
        statusFilter={null}
        onChange={onChange}
      />
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText(statusOptions[0].label)).toBeInTheDocument();
    expect(screen.getByText(statusOptions[1].label)).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('calls onChange with null when "All" is selected (mobile)', () => {
    require('@mui/material').useMediaQuery.mockReturnValue(true);

    render(
      <BooksFilter
        filterValue={EStatus.READING}
        statusOptions={statusOptions}
        statusFilter={EStatus.READING}
        onChange={onChange}
      />
    );

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('All'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange with correct status when option is selected (mobile)', () => {
    require('@mui/material').useMediaQuery.mockReturnValue(true);

    render(
      <BooksFilter
        filterValue="all"
        statusOptions={statusOptions}
        statusFilter={null}
        onChange={onChange}
      />
    );

    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText(statusOptions[0].label));
    expect(onChange).toHaveBeenCalledWith(EStatus.READING);
  });

  it('calls onChange with null when "All" is selected (desktop)', () => {
    require('@mui/material').useMediaQuery.mockReturnValue(false);

    render(
      <BooksFilter
        filterValue={EStatus.READING}
        statusOptions={statusOptions}
        statusFilter={EStatus.READING}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByLabelText('All'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange with correct status when option is selected (desktop)', () => {
    require('@mui/material').useMediaQuery.mockReturnValue(false);

    render(
      <BooksFilter
        filterValue="all"
        statusOptions={statusOptions}
        statusFilter={null}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByLabelText(statusOptions[0].label));
    expect(onChange).toHaveBeenCalledWith(EStatus.READING);
  });
});
