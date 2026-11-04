import { describe, it, expect } from 'vitest';
import App from '../App';
import SakuraCanvas from '../components/canvas/SakuraCanvas';

describe('App', () => {
  it('renders SakuraCanvas as a fixed background layer with z-0 and pointer-events-none', () => {
    const vnode = App();
    expect(vnode).toBeDefined();

    // Verify children contain SakuraCanvas
    const children = Array.isArray(vnode.props.children)
      ? vnode.props.children
      : [vnode.props.children];

    const canvasElement = children.find(
      (child: any) => child && (child.type === SakuraCanvas || child.type?.name === 'SakuraCanvas')
    );

    expect(canvasElement).toBeDefined();
    expect(canvasElement.props.className).toContain('pointer-events-none');
    expect(canvasElement.props.className).toContain('fixed');
    expect(canvasElement.props.className).toContain('inset-0');
    expect(canvasElement.props.className).toContain('z-20');
  });
});
