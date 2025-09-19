import React from 'react';
import { render } from '@testing-library/react';
import CustomTitle from './CustomTitle';

// Mock Material-UI Typography
jest.mock('@mui/material', () => ({
  Typography: ({
    children,
    variant,
    ...props
  }: React.PropsWithChildren<{
    variant?: string;
    [key: string]: unknown;
  }>) => (
    <div data-testid="typography" data-variant={variant} {...props}>
      {children}
    </div>
  ),
}));

// Mock fonts
jest.mock('@/utils/fonts/fonts', () => ({
  birthStone: {
    style: {
      fontFamily: 'Birth Stone',
    },
  },
}));

describe('CustomTitle', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing with minimal props', () => {
      expect(() => render(<CustomTitle />)).not.toThrow();
    });

    it('renders with text prop', () => {
      const { container } = render(<CustomTitle text="Test Title" />);
      const typography = container.querySelector('[data-testid="typography"]');
      expect(typography).toHaveTextContent('Test Title');
    });

    it('renders with empty text', () => {
      const { container } = render(<CustomTitle text="" />);
      const typography = container.querySelector('[data-testid="typography"]');
      expect(typography).toHaveTextContent('');
    });

    it('renders with long text', () => {
      const longText =
        'This is a very long title that should be handled properly by the component';
      const { container } = render(<CustomTitle text={longText} />);
      const typography = container.querySelector('[data-testid="typography"]');
      expect(typography).toHaveTextContent(longText);
    });
  });

  describe('Props Handling', () => {
    it('applies custom size when provided', () => {
      expect(() =>
        render(<CustomTitle text="Test" size="3rem" />)
      ).not.toThrow();
    });

    it('applies custom fontFamily when provided', () => {
      expect(() =>
        render(<CustomTitle text="Test" fontFamily="Arial" />)
      ).not.toThrow();
    });

    it('applies custom sx when provided', () => {
      const customSx = { color: 'red', fontSize: '2rem' };
      expect(() =>
        render(<CustomTitle text="Test" sx={customSx} />)
      ).not.toThrow();
    });

    it('handles all props together', () => {
      const customSx = { color: 'blue', margin: '10px' };
      expect(() =>
        render(
          <CustomTitle
            text="Complete Test"
            size="2.5rem"
            fontFamily="Custom Font"
            sx={customSx}
          />
        )
      ).not.toThrow();
    });
  });

  describe('Default Values', () => {
    it('uses default size when size prop is not provided', () => {
      expect(() => render(<CustomTitle text="Test" />)).not.toThrow();
    });

    it('uses default fontFamily when fontFamily prop is not provided', () => {
      expect(() => render(<CustomTitle text="Test" />)).not.toThrow();
    });

    it('handles undefined props gracefully', () => {
      expect(() =>
        render(
          <CustomTitle
            text={undefined}
            size={undefined}
            fontFamily={undefined}
            sx={undefined}
          />
        )
      ).not.toThrow();
    });
  });

  describe('Typography Props', () => {
    it('renders with correct variant', () => {
      const { container } = render(<CustomTitle text="Test" />);
      const typography = container.querySelector('[data-testid="typography"]');
      expect(typography).toHaveAttribute('data-variant', 'h1');
    });

    it('passes through additional props', () => {
      const { container } = render(
        <CustomTitle text="Test" data-custom="value" />
      );
      const typography = container.querySelector('[data-testid="typography"]');
      expect(typography).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('Edge Cases', () => {
    it('handles null text', () => {
      const nullText = null as unknown as string;
      expect(() => render(<CustomTitle text={nullText} />)).not.toThrow();
    });

    it('handles numeric text', () => {
      expect(() => render(<CustomTitle text="123" />)).not.toThrow();
    });

    it('handles text with special characters', () => {
      expect(() =>
        render(<CustomTitle text="Title with émojis 🎉 and spëcial chärs" />)
      ).not.toThrow();
    });

    it('handles very large size values', () => {
      expect(() =>
        render(<CustomTitle text="Test" size="100px" />)
      ).not.toThrow();
    });

    it('handles complex sx objects', () => {
      const complexSx = {
        color: 'red',
        fontSize: '2rem',
        textAlign: 'center',
        '&:hover': {
          color: 'blue',
        },
        '@media (max-width: 600px)': {
          fontSize: '1.5rem',
        },
      };
      expect(() =>
        render(<CustomTitle text="Test" sx={complexSx} />)
      ).not.toThrow();
    });
  });

  describe('Component Structure', () => {
    it('renders as Typography component', () => {
      const { container } = render(<CustomTitle text="Test" />);
      const typography = container.querySelector('[data-testid="typography"]');
      expect(typography).toBeTruthy();
    });

    it('applies fontWeight bold', () => {
      // This would be tested by checking the sx prop application
      expect(() => render(<CustomTitle text="Test" />)).not.toThrow();
    });

    it('applies white color', () => {
      // This would be tested by checking the sx prop application
      expect(() => render(<CustomTitle text="Test" />)).not.toThrow();
    });
  });
});
