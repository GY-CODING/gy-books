import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileHeader } from './ProfileHeader';

const mockUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  avatar: 'avatar-url',
};

const defaultProps = {
  user: mockUser,
  friendsCount: 5,
  isLoadingFriends: false,
  onEditProfile: jest.fn(),
  biography: 'This is a biography.',
  isEditingBiography: false,
  isLoadingBiography: false,
  onBiographyChange: jest.fn(),
  onBiographySave: jest.fn(),
  onBiographyCancel: jest.fn(),
};

describe('ProfileHeader', () => {
  it('renders username and email', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('(testuser@example.com)')).toBeInTheDocument();
  });

  it('renders friends count and label', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('friends')).toBeInTheDocument();
  });

  it('shows loading state for friends', () => {
    render(<ProfileHeader {...defaultProps} isLoadingFriends={true} />);
    expect(screen.getByTestId('friends-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('friends')).not.toBeInTheDocument();
  });

  it('renders biography section', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('This is a biography.')).toBeInTheDocument();
  });

  it('calls onEditProfile when Edit Profile button is clicked', () => {
    render(<ProfileHeader {...defaultProps} />);
    const editProfileBtn = screen.getByText('Edit Profile');
    fireEvent.click(editProfileBtn);
    expect(defaultProps.onEditProfile).toHaveBeenCalled();
  });

  it('renders Edit Account button with correct link', () => {
    render(<ProfileHeader {...defaultProps} />);
    const editAccountBtn = screen.getByText('Edit Account');
    expect(editAccountBtn.closest('a')).toHaveAttribute(
      'href',
      'https://accounts.gycoding.com'
    );
  });

  it('renders UserImage component', () => {
    render(<ProfileHeader {...defaultProps} />);
    // UserImage renders an img or avatar, so check for alt text or role
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
