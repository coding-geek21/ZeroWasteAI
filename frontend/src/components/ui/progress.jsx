import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const trackColors = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-400',
};

/**
 * Progress bar component.
 * @param {number} value - 0-100
 * @param {string} color - 'green' | 'yellow' | 'red' | 'blue' | 'gray'
 * @param {boolean} showLabel - whether to show percentage label
 */
export function Progress({ value = 0, color = 'green', showLabel = false, className = '' }) {
  const clamped = Math.max(0, Math.min(100, value));

  // Auto-select color based on value if color = 'auto'
  let barColor = color;
  if (color === 'auto') {
    if (clamped >= 70) barColor = 'green';
    else if (clamped >= 35) barColor = 'yellow';
    else barColor = 'red';
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', trackColors[barColor] || trackColors.green)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-500 w-8 text-right">{clamped}%</span>
      )}
    </div>
  );
}
