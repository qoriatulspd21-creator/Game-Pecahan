import React from 'react';

export interface MathFractionProps {
  num: number | string | React.ReactNode;
  den: number | string | React.ReactNode;
  className?: string;
  size?: '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  lineColor?: string;
  title?: string;
}

const SIZE_STYLES: Record<
  NonNullable<MathFractionProps['size']>,
  { text: string; line: string; minW: string; padY: string; gap: string }
> = {
  '2xs': { text: 'text-[9px]', line: 'h-[1px]', minW: 'min-w-[8px]', padY: 'py-0', gap: 'my-[0.5px]' },
  xs: { text: 'text-[10px] sm:text-[11px]', line: 'h-[1.5px]', minW: 'min-w-[10px]', padY: 'py-0', gap: 'my-[1px]' },
  sm: { text: 'text-xs sm:text-[13px]', line: 'h-[1.5px]', minW: 'min-w-[12px]', padY: 'py-0', gap: 'my-[1px]' },
  base: { text: 'text-xs sm:text-sm', line: 'h-[1.5px]', minW: 'min-w-[14px]', padY: 'py-0', gap: 'my-[1px]' },
  lg: { text: 'text-sm sm:text-base', line: 'h-[2px]', minW: 'min-w-[16px]', padY: 'py-0', gap: 'my-[1.5px]' },
  xl: { text: 'text-base sm:text-lg', line: 'h-[2px]', minW: 'min-w-[18px]', padY: 'py-0', gap: 'my-[2px]' },
  '2xl': { text: 'text-xl sm:text-2xl', line: 'h-[2.5px]', minW: 'min-w-[22px]', padY: 'py-0.5', gap: 'my-[2px]' },
  '3xl': { text: 'text-2xl sm:text-3xl', line: 'h-[3px]', minW: 'min-w-[26px]', padY: 'py-0.5', gap: 'my-[2.5px]' },
};

export const MathFraction: React.FC<MathFractionProps> = ({
  num,
  den,
  className = '',
  size = 'base',
  lineColor = 'bg-current',
  title,
}) => {
  const styles = SIZE_STYLES[size] || SIZE_STYLES.base;
  const computedTitle = title || `${num} per ${den}`;

  return (
    <span
      className={`inline-flex flex-col items-center justify-center align-middle font-heading font-black select-none ${styles.text} ${className}`}
      title={computedTitle}
      aria-label={computedTitle}
      style={{ lineHeight: 1.05 }}
    >
      {/* Pembilang (Numerator) di atas */}
      <span className="leading-tight text-center px-0.5 block">{num}</span>

      {/* Garis Pecahan (Vinculum / Horizontal Divider) di tengah */}
      <span
        className={`w-full ${styles.minW} ${styles.line} ${lineColor} rounded-full ${styles.gap} opacity-95 shrink-0 block`}
      />

      {/* Penyebut (Denominator) di bawah */}
      <span className="leading-tight text-center px-0.5 block">{den}</span>
    </span>
  );
};
