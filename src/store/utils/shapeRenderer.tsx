import React from 'react';
import { ShapeElement as ShapeElementType } from '../types/presentation';

export function renderShape(element: ShapeElementType): React.ReactElement {
  const { width: w, height: h } = element.size;
  const { strokeWidth: sw, fill, stroke, shapeType } = element;
  const radius = Math.min(w, h) / 2;

  const commonProps = {
    fill,
    stroke,
    strokeWidth: sw,
    strokeLinejoin: 'round' as const,
  };

  switch (shapeType) {
    case 'rectangle':
      return <rect {...commonProps} x={sw / 2} y={sw / 2} width={w - sw} height={h - sw} />;

    case 'circle':
      return <circle {...commonProps} cx={w / 2} cy={h / 2} r={radius - sw / 2} />;

    case 'triangle':
      return (
        <polygon {...commonProps} points={`${sw},${h - sw} ${w / 2},${sw} ${w - sw},${h - sw}`} />
      );

    case 'star': {
      const points = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? radius * 0.6 : radius * 0.3;
        const angle = (Math.PI / 5) * i;
        return `${w / 2 + r * Math.sin(angle)},${h / 2 + r * Math.cos(angle)}`;
      });
      return <polygon {...commonProps} points={points.join(' ')} />;
    }

    case 'hexagon': {
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i;
        return `${w / 2 + radius * Math.sin(angle)},${h / 2 + radius * Math.cos(angle)}`;
      });
      return <polygon {...commonProps} points={points.join(' ')} />;
    }

    case 'heart':
      return (
        <path
          {...commonProps}
          d={`
            M ${w / 2} ${h * 0.3}
            Q ${w * 0.7} ${h * 0.1} ${w * 0.8} ${h * 0.3}
            Q ${w * 0.9} ${h * 0.5} ${w / 2} ${h * 0.8}
            Q ${w * 0.1} ${h * 0.5} ${w * 0.2} ${h * 0.3}
            Q ${w * 0.3} ${h * 0.1} ${w / 2} ${h * 0.3}
            Z
          `}
        />
      );

    case 'cloud':
      return (
        <path
          {...commonProps}
          d={`
            M ${w * 0.25} ${h * 0.6}
            C ${w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.45} ${w * 0.28} ${h * 0.45}
            C ${w * 0.3} ${h * 0.3} ${w * 0.45} ${h * 0.28} ${w * 0.5} ${h * 0.4}
            C ${w * 0.58} ${h * 0.25} ${w * 0.78} ${h * 0.3} ${w * 0.78} ${h * 0.45}
            C ${w * 0.9} ${h * 0.48} ${w * 0.88} ${h * 0.65} ${w * 0.72} ${h * 0.65}
            H ${w * 0.28}
            C ${w * 0.26} ${h * 0.65} ${w * 0.25} ${h * 0.62} ${w * 0.25} ${h * 0.6}
            Z
          `}
        />
      );

    case 'callout': {
      const bodyHeight = h - 16 - sw;
      const cx = w / 2;
      const r = 12;

      return (
        <path
          {...commonProps}
          d={`
            M ${r} ${sw / 2}
            H ${w - r}
            Q ${w} ${sw / 2} ${w} ${r}
            V ${bodyHeight - r}
            Q ${w} ${bodyHeight} ${w - r} ${bodyHeight}
            H ${cx + 12}
            L ${cx} ${bodyHeight + 16}
            L ${cx - 12} ${bodyHeight}
            H ${r}
            Q ${sw / 2} ${bodyHeight} ${sw / 2} ${bodyHeight - r}
            V ${r}
            Q ${sw / 2} ${sw / 2} ${r} ${sw / 2}
            Z
          `}
        />
      );
    }

    default:
      return <rect {...commonProps} x={sw / 2} y={sw / 2} width={w - sw} height={h - sw} />;
  }
}
