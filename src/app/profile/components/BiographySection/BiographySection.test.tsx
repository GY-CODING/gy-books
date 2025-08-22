import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BiographySection } from './BiographySection';

describe('BiographySection', () => {
  const defaultProps = {
    biography: 'Test biography',
    isEditing: false,
    isLoading: false,
    onChange: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  it('renders biography in view mode', () => {
    render(<BiographySection {...defaultProps} />);
    expect(screen.getByText('Test biography')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/Write your biography/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Save/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument();
  });

  it('renders default text when biography is empty', () => {
    render(<BiographySection {...defaultProps} biography="" />);
    expect(
      screen.getByText('Aquí irá la biografía del usuario.')
    ).toBeInTheDocument();
  });

  it('renders text field and buttons in edit mode', () => {
    render(<BiographySection {...defaultProps} isEditing />);
    expect(
      screen.getByPlaceholderText(/Write your biography/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it('calls onChange when biography is edited', () => {
    render(<BiographySection {...defaultProps} isEditing />);
    const textarea = screen.getByPlaceholderText(/Write your biography/i);
    fireEvent.change(textarea, { target: { value: 'New bio' } });
    expect(defaultProps.onChange).toHaveBeenCalledWith('New bio');
  });

  it('calls onSave when Save button is clicked', () => {
    render(<BiographySection {...defaultProps} isEditing />);
    fireEvent.click(screen.getByText(/Save/i));
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<BiographySection {...defaultProps} isEditing />);
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('disables Save button when isLoading is true', () => {
    render(<BiographySection {...defaultProps} isEditing isLoading />);
    const saveButton = screen.getByText(/Save/i).closest('button');
    expect(saveButton).toBeDisabled();
  });
});
