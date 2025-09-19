import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { CustomButton } from './customButton';

// Mock Material-UI Button
jest.mock('@mui/material/Button', () => {
  return jest.fn().mockImplementation((props) => {
    const {
      children,
      onClick,
      disabled,
      loading,
      variant = 'contained',
      component = 'button',
      href,
      target,
      endIcon,
      startIcon,
      ...restProps
    } = props;

    const Element = component === 'a' ? 'a' : 'button';

    return React.createElement(
      Element,
      {
        'data-testid': 'button',
        onClick: component === 'a' ? undefined : onClick,
        disabled: component === 'a' ? undefined : disabled || loading,
        'data-variant': variant,
        'data-component': component,
        'data-loading': loading,
        href: component === 'a' ? href : undefined,
        target: component === 'a' ? target : undefined,
        ...restProps,
      },
      [
        startIcon &&
          React.createElement(
            'span',
            { key: 'start', 'data-testid': 'start-icon' },
            startIcon
          ),
        children,
        endIcon &&
          React.createElement(
            'span',
            { key: 'end', 'data-testid': 'end-icon' },
            endIcon
          ),
      ].filter(Boolean)
    );
  });
});

describe('CustomButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders without crashing with minimal props', () => {
      expect(() =>
        render(<CustomButton>Test Button</CustomButton>)
      ).not.toThrow();
    });

    it('renders children correctly', () => {
      const { container } = render(<CustomButton>Test Button</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveTextContent('Test Button');
    });

    it('renders with different text content', () => {
      const { container } = render(<CustomButton>Click me!</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveTextContent('Click me!');
    });
  });

  describe('Button Types', () => {
    it('renders ACTION type by default', () => {
      const { container } = render(<CustomButton>Test</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toBeTruthy();
    });

    it('renders CANCEL type', () => {
      const { container } = render(
        <CustomButton type="CANCEL">Cancel</CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toBeTruthy();
    });

    it('handles both ACTION and CANCEL types', () => {
      expect(() =>
        render(<CustomButton type="ACTION">Action</CustomButton>)
      ).not.toThrow();
      expect(() =>
        render(<CustomButton type="CANCEL">Cancel</CustomButton>)
      ).not.toThrow();
    });
  });

  describe('Variants', () => {
    it('renders contained variant by default', () => {
      const { container } = render(<CustomButton>Test</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveAttribute('data-variant', 'contained');
    });

    it('renders outlined variant', () => {
      const { container } = render(
        <CustomButton variant="outlined">Test</CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveAttribute('data-variant', 'outlined');
    });

    it('handles both contained and outlined variants', () => {
      expect(() =>
        render(<CustomButton variant="contained">Contained</CustomButton>)
      ).not.toThrow();
      expect(() =>
        render(<CustomButton variant="outlined">Outlined</CustomButton>)
      ).not.toThrow();
    });
  });

  describe('Component Variants', () => {
    it('renders as button by default', () => {
      const { container } = render(<CustomButton>Test</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveAttribute('data-component', 'button');
    });

    it('renders as link when variantComponent is link', () => {
      const { container } = render(
        <CustomButton variantComponent="link" href="/test">
          Test
        </CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveAttribute('data-component', 'a');
      expect(button).toHaveAttribute('href', '/test');
    });

    it('handles both button and link variants', () => {
      expect(() =>
        render(<CustomButton variantComponent="button">Button</CustomButton>)
      ).not.toThrow();
      expect(() =>
        render(
          <CustomButton variantComponent="link" href="/test">
            Link
          </CustomButton>
        )
      ).not.toThrow();
    });
  });

  describe('Icons', () => {
    it('renders with startIcon', () => {
      const { container } = render(
        <CustomButton startIcon={<span>🚀</span>}>Test</CustomButton>
      );
      const startIcon = container.querySelector('[data-testid="start-icon"]');
      expect(startIcon).toBeTruthy();
      expect(startIcon).toHaveTextContent('🚀');
    });

    it('renders with endIcon', () => {
      const { container } = render(
        <CustomButton endIcon={<span>➡️</span>}>Test</CustomButton>
      );
      const endIcon = container.querySelector('[data-testid="end-icon"]');
      expect(endIcon).toBeTruthy();
      expect(endIcon).toHaveTextContent('➡️');
    });

    it('renders with both start and end icons', () => {
      const { container } = render(
        <CustomButton startIcon={<span>🚀</span>} endIcon={<span>➡️</span>}>
          Test
        </CustomButton>
      );
      const startIcon = container.querySelector('[data-testid="start-icon"]');
      const endIcon = container.querySelector('[data-testid="end-icon"]');
      expect(startIcon).toBeTruthy();
      expect(endIcon).toBeTruthy();
    });

    it('renders without icons', () => {
      const { container } = render(<CustomButton>Test</CustomButton>);
      const startIcon = container.querySelector('[data-testid="start-icon"]');
      const endIcon = container.querySelector('[data-testid="end-icon"]');
      expect(startIcon).toBeNull();
      expect(endIcon).toBeNull();
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      const { container } = render(<CustomButton disabled>Test</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toBeDisabled();
    });

    it('handles loading state', () => {
      const { container } = render(<CustomButton isLoading>Test</CustomButton>);
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled();
    });

    it('handles both disabled and loading states', () => {
      const { container } = render(
        <CustomButton disabled isLoading>
          Test
        </CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Events', () => {
    it('calls onClick when clicked', () => {
      const { container } = render(
        <CustomButton onClick={mockOnClick}>Test</CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');

      fireEvent.click(button!);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const { container } = render(
        <CustomButton onClick={mockOnClick} disabled>
          Test
        </CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');

      fireEvent.click(button!);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const { container } = render(
        <CustomButton onClick={mockOnClick} isLoading>
          Test
        </CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');

      fireEvent.click(button!);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Link Props', () => {
    it('handles href and target for links', () => {
      const { container } = render(
        <CustomButton variantComponent="link" href="/test-page" target="_blank">
          Test Link
        </CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');
      expect(button).toHaveAttribute('href', '/test-page');
      expect(button).toHaveAttribute('target', '_blank');
    });

    it('ignores href and target for buttons', () => {
      const { container } = render(
        <CustomButton
          variantComponent="button"
          href="/test-page"
          target="_blank"
        >
          Test Button
        </CustomButton>
      );
      const button = container.querySelector('[data-testid="button"]');
      expect(button).not.toHaveAttribute('href');
      expect(button).not.toHaveAttribute('target');
    });
  });

  describe('Styling Props', () => {
    it('accepts custom sx prop', () => {
      const customSx = { margin: '10px', padding: '20px' };
      expect(() =>
        render(<CustomButton sx={customSx}>Test</CustomButton>)
      ).not.toThrow();
    });

    it('handles complex sx objects', () => {
      const complexSx = {
        backgroundColor: 'red',
        '&:hover': { backgroundColor: 'blue' },
        '@media (max-width: 600px)': { fontSize: '14px' },
      };
      expect(() =>
        render(<CustomButton sx={complexSx}>Test</CustomButton>)
      ).not.toThrow();
    });
  });

  describe('Complex Combinations', () => {
    it('renders with all props combined', () => {
      const customSx = { marginTop: '10px' };
      expect(() =>
        render(
          <CustomButton
            onClick={mockOnClick}
            variant="outlined"
            variantComponent="link"
            href="/test"
            target="_blank"
            isLoading={false}
            disabled={false}
            startIcon={<span>🚀</span>}
            endIcon={<span>➡️</span>}
            sx={customSx}
            type="CANCEL"
          >
            Complex Button
          </CustomButton>
        )
      ).not.toThrow();
    });

    it('handles loading ACTION button with icons', () => {
      expect(() =>
        render(
          <CustomButton
            isLoading
            type="ACTION"
            startIcon={<span>⏳</span>}
            endIcon={<span>✨</span>}
          >
            Loading Action
          </CustomButton>
        )
      ).not.toThrow();
    });

    it('handles disabled CANCEL link with custom styling', () => {
      const customSx = { opacity: 0.5 };
      expect(() =>
        render(
          <CustomButton
            disabled
            type="CANCEL"
            variantComponent="link"
            href="/disabled"
            sx={customSx}
          >
            Disabled Cancel Link
          </CustomButton>
        )
      ).not.toThrow();
    });
  });
});
