import { MULTI_COLOR } from '../types';

const MULTI_GRADIENT =
  'conic-gradient(from 90deg, #ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #a855f7, #ef4444)';

export default function ColorSwatch({
  hex,
  size = 14,
  borderColor = '#e2e8f0',
  className = '',
}: {
  hex: string;
  size?: number;
  borderColor?: string;
  className?: string;
}) {
  const isMulti = hex === MULTI_COLOR;
  return (
    <span
      className={`shrink-0 rounded-full border ${className}`}
      style={{
        width: size,
        height: size,
        borderColor,
        background: isMulti ? MULTI_GRADIENT : hex || '#e5e7eb',
      }}
    />
  );
}
