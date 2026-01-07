import React from 'react';
import { ShapeElement as ShapeEl } from '../../../../../store/types/presentation';
import { getShadowStyle } from './Helpers';

interface Props {
  element: ShapeEl;
  scale: number;
}

export function ShapeElement({ element, scale }: Props) {
  const s = scale;
  const w = element.size.width * s;
  const h = element.size.height * s;
  const sw = element.strokeWidth * s;
  const radius = Math.min(w, h) / 2;
  const shadowStyle = getShadowStyle(element.shadow, s);

  const commonStyle = {
    filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
  };

  const polygon = (points: string) => (
    <polygon
      points={points}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={sw}
      strokeLinejoin="round"
      style={commonStyle}
    />
  );

  const path = (d: string) => (
    <path
      d={d}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={sw}
      strokeLinejoin="round"
      strokeLinecap="round"
      style={commonStyle}
    />
  );

  let shape: React.ReactNode = null;

  switch (element.shapeType) {
    case 'rectangle':
      shape = (
        <rect
          x={sw / 2}
          y={sw / 2}
          width={w - sw}
          height={h - sw}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={sw}
          style={commonStyle}
        />
      );
      break;
    case 'circle':
      shape = (
        <circle
          cx={w / 2}
          cy={h / 2}
          r={radius - sw / 2}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={sw}
          style={commonStyle}
        />
      );
      break;
    case 'triangle':
      shape = polygon(`${sw},${h - sw} ${w / 2},${sw} ${w - sw},${h - sw}`);
      break;
    case 'star': {
      const points: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? radius * 0.6 : radius * 0.3;
        const angle = (Math.PI / 5) * i;
        points.push(`${w / 2 + r * Math.sin(angle)},${h / 2 + r * Math.cos(angle)}`);
      }
      shape = polygon(points.join(' '));
      break;
    }
    case 'hexagon': {
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i;
        return `${w / 2 + radius * Math.sin(angle)},${h / 2 + radius * Math.cos(angle)}`;
      });
      shape = polygon(points.join(' '));
      break;
    }
    case 'heart':
      shape = path(`
        M ${w / 2} ${h * 0.3}
        Q ${w * 0.7} ${h * 0.1} ${w * 0.8} ${h * 0.3}
        Q ${w * 0.9} ${h * 0.5} ${w / 2} ${h * 0.8}
        Q ${w * 0.1} ${h * 0.5} ${w * 0.2} ${h * 0.3}
        Q ${w * 0.3} ${h * 0.1} ${w / 2} ${h * 0.3} Z
      `);
      break;
    case 'cloud':
      shape = path(`
        M ${w * 0.25} ${h * 0.6}
        C ${w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.45} ${w * 0.28} ${h * 0.45}
        C ${w * 0.3} ${h * 0.3} ${w * 0.45} ${h * 0.28} ${w * 0.5} ${h * 0.4}
        C ${w * 0.58} ${h * 0.25} ${w * 0.78} ${h * 0.3} ${w * 0.78} ${h * 0.45}
        C ${w * 0.9} ${h * 0.48} ${w * 0.88} ${h * 0.65} ${w * 0.72} ${h * 0.65}
        H ${w * 0.28}
        C ${w * 0.26} ${h * 0.65} ${w * 0.25} ${h * 0.62} ${w * 0.25} ${h * 0.6} Z
      `);
      break;
    case 'callout': {
      const bodyHeight = h - 16 * s - sw;
      const cx = w / 2;
      const r = 12 * s;
      const tailW = 24 * s;
      const tailH = 16 * s;
      shape = path(`
        M ${r} ${sw / 2}
        H ${w - r}
        Q ${w} ${sw / 2} ${w} ${r}
        V ${bodyHeight - r}
        Q ${w} ${bodyHeight} ${w - r} ${bodyHeight}
        H ${cx + tailW / 2}
        L ${cx} ${bodyHeight + tailH}
        L ${cx - tailW / 2} ${bodyHeight}
        H ${r}
        Q ${sw / 2} ${bodyHeight} ${sw / 2} ${bodyHeight - r}
        V ${r}
        Q ${sw / 2} ${sw / 2} ${r} ${sw / 2} Z
      `);
      break;
    }
    default:
      shape = null;
  }

  return (
    <svg
      className="slide-svg-element"
      width={w}
      height={h}
      style={{
        left: element.position.x * s,
        top: element.position.y * s,
      }}
    >
      {shape}
    </svg>
  );
}
