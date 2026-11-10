import React from 'react';
import { describe, it, expect } from 'vitest';
import { KatanaSvgContent } from '../KatanaSvgContent';

describe('KatanaSvgContent component', () => {
  it('renders default katana blade, tsuka, and tsuba without hand grip', () => {
    const element = KatanaSvgContent({ variant: 'default' }) as React.ReactElement<{
      children?: React.ReactNode;
    }>;
    expect(element).toBeDefined();
    // Default mode renders katana sword without the samurai hand grip
    const children = React.Children.toArray(element.props.children) as Array<
      React.ReactElement<{ id?: string }>
    >;
    const hasHandGrip = children.some((c) => c.props?.id === 'samurai-hand-grip');
    expect(hasHandGrip).toBe(false);
  });

  it('renders armored samurai gauntlet gripping the handle when in pointer or clicking mode', () => {
    const pointerElement = KatanaSvgContent({ variant: 'pointer' }) as React.ReactElement<{
      children?: React.ReactNode;
    }>;
    expect(pointerElement).toBeDefined();
    const pointerChildren = React.Children.toArray(pointerElement.props.children) as Array<
      React.ReactElement<{ id?: string }>
    >;
    const hasHandGripPointer = pointerChildren.some((c) => c.props?.id === 'samurai-hand-grip');
    expect(hasHandGripPointer).toBe(true);

    const clickingElement = KatanaSvgContent({ variant: 'clicking' }) as React.ReactElement<{
      children?: React.ReactNode;
    }>;
    expect(clickingElement).toBeDefined();
    const clickingChildren = React.Children.toArray(clickingElement.props.children) as Array<
      React.ReactElement<{ id?: string }>
    >;
    const hasHandGripClicking = clickingChildren.some((c) => c.props?.id === 'samurai-hand-grip');
    expect(hasHandGripClicking).toBe(true);
  });

  it('renders twin-staff baton straight in vertical orientation when in text mode', () => {
    const textElement = KatanaSvgContent({ variant: 'text' }) as React.ReactElement<{
      id: string;
      children: React.ReactNode;
    }>;
    expect(textElement).toBeDefined();
    expect(textElement.props.id).toBe('twin-staff-cursor');
  });
});
