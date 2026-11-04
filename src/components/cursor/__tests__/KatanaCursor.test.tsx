import type React from 'react';
import { describe, it, expect, vi } from 'vitest';
import KatanaCursor from '../KatanaCursor';

vi.mock('../useKatanaMotion', () => ({
  useKatanaMotion: vi.fn(() => ({
    x: 120,
    y: 250,
    angle: 45,
    speed: 300,
    isVisible: true,
  })),
}));

describe('KatanaCursor component', () => {
  it('renders a fixed container with pointer-events-none and katana SVG', () => {
    const element = KatanaCursor({}) as React.ReactElement<{
      className: string;
      'aria-hidden': string;
      style: React.CSSProperties;
      children: React.ReactElement<any>;
    }>;
    expect(element).toBeDefined();
    expect(element.props.className).toContain('pointer-events-none');
    expect(element.props.className).toContain('fixed');
    expect(element.props['aria-hidden']).toBe('true');
    expect(element.props.style.transform).toContain('translate3d(120px, 250px, 0)');
    expect(element.props.style.transform).toContain('rotate(45deg)');

    // Katana SVG inside
    const svgChild = element.props.children;
    expect(svgChild).toBeDefined();
    expect(svgChild.type).toBe('svg');
  });

  it('accepts custom className and merges it properly', () => {
    const element = KatanaCursor({ className: 'custom-katana' }) as React.ReactElement<{
      className: string;
    }>;
    expect(element.props.className).toContain('custom-katana');
  });
});
