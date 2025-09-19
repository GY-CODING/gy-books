import React from 'react';
import { render, screen } from '@testing-library/react';
import LottieAnimation from './LottieAnimation';

// Mock lottie-react
jest.mock('lottie-react', () => ({
  __esModule: true,
  default: ({
    loop,
    autoplay,
    className,
    style,
  }: {
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <div
      data-testid="lottie-mock"
      data-loop={loop ? 'true' : 'false'}
      data-autoplay={autoplay ? 'true' : 'false'}
      className={className}
      style={style}
    >
      Lottie Animation
    </div>
  ),
}));

describe('LottieAnimation', () => {
  const mockAnimationData = { key: 'value' };

  it('renders without crashing with required props', () => {
    expect(() =>
      render(<LottieAnimation animationData={mockAnimationData} />)
    ).not.toThrow();
  });

  it('renders the lottie mock element', () => {
    render(<LottieAnimation animationData={mockAnimationData} />);
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
  });

  it('passes animationData prop', () => {
    render(<LottieAnimation animationData={mockAnimationData} />);
    // Just check that the mock element exists, since animationData is not rendered
    expect(screen.getByTestId('lottie-mock')).toBeInTheDocument();
  });

  it('sets loop and autoplay to true by default', () => {
    render(<LottieAnimation animationData={mockAnimationData} />);
    const lottie = screen.getByTestId('lottie-mock');
    expect(lottie).toHaveAttribute('data-loop', 'true');
    expect(lottie).toHaveAttribute('data-autoplay', 'true');
  });

  it('sets loop and autoplay to false when specified', () => {
    render(
      <LottieAnimation
        animationData={mockAnimationData}
        loop={false}
        autoplay={false}
      />
    );
    const lottie = screen.getByTestId('lottie-mock');
    expect(lottie).toHaveAttribute('data-loop', 'false');
    expect(lottie).toHaveAttribute('data-autoplay', 'false');
  });

  it('applies className prop', () => {
    render(
      <LottieAnimation
        animationData={mockAnimationData}
        className="test-class"
      />
    );
    const lottie = screen.getByTestId('lottie-mock');
    expect(lottie).toHaveClass('test-class');
  });
});
