import React from 'react';
import { render } from '@testing-library/react';
import { UserImage } from './UserImage';
import { UUID } from 'crypto';

const mockUser = {
  id: '00000000-0000-0000-0000-000000000001' as UUID,
  username: 'testuser',
  picture: '/test-picture.jpg',
  apiKey: 'test-api-key',
  phoneNumber: null,
  email: 'test@example.com',
  biography: 'Test bio',
};

describe('UserImage', () => {
  it('renders the user image with correct src and alt', () => {
    const { getByRole } = render(<UserImage user={mockUser} />);
    const img = getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('test-picture'));
    expect(img).toHaveAttribute('alt', 'testuser');
  });

  it('applies correct width and height', () => {
    const { getByRole } = render(<UserImage user={mockUser} />);
    const img = getByRole('img');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
  });

  it('applies style props for avatar', () => {
    const { getByRole } = render(<UserImage user={mockUser} />);
    const img = getByRole('img');
    expect(img).toHaveStyle('border-radius: 50%');
    expect(img).toHaveStyle('border: 3px solid #8C54FF');
    expect(img).toHaveStyle('background-color: #232323');
    expect(img).toHaveStyle('aspect-ratio: 1/1');
    expect(img).toHaveStyle('object-fit: cover');
  });

  it('renders empty src and alt if user is missing', () => {
    const emptyUser = {
      id: '00000000-0000-0000-0000-000000000000' as UUID,
      username: '',
      picture: '',
      apiKey: '',
      phoneNumber: null,
      email: '',
      biography: null,
    };
    const { getByAltText } = render(<UserImage user={emptyUser} />);
    const img = getByAltText('');
    expect(img).toHaveAttribute('src', '');
    expect(img).toHaveAttribute('alt', '');
  });
});
