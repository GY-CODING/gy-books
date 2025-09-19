import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AnimatedAlert from './Alert';
import { ESeverity } from '@/utils/constants/ESeverity';

jest.useFakeTimers();

describe('AnimatedAlert', () => {
  const defaultProps = {
    open: true,
    message: 'Test message',
    onClose: jest.fn(),
    severity: ESeverity.SUCCESS,
    title: 'Test Title',
    duration: 3000,
  };

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('renders the alert when open is true', () => {
    render(<AnimatedAlert {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render the alert when open is false', () => {
    render(<AnimatedAlert {...defaultProps} open={false} />);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('calls onClose after duration', () => {
    render(<AnimatedAlert {...defaultProps} />);
    act(() => {
      jest.advanceTimersByTime(defaultProps.duration);
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders with default severity if not provided', () => {
    render(<AnimatedAlert open={true} message="Default severity" />);
    expect(screen.getByText('Default severity')).toBeInTheDocument();
  });

  it('renders AlertTitle when title is provided', () => {
    render(<AnimatedAlert {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render AlertTitle when title is not provided', () => {
    render(
      <AnimatedAlert
        open={true}
        message="Test message"
        onClose={jest.fn()}
        severity={ESeverity.SUCCESS}
      />
    );
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('does not render AlertTitle when title is an empty string', () => {
    render(
      <AnimatedAlert
        open={true}
        message="Test message"
        onClose={jest.fn()}
        severity={ESeverity.SUCCESS}
        title=""
      />
    );
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });
});
