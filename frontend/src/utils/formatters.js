/**
 * Format a date string or Date object to a human-readable form
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export function formatDate(date, options = {}) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format weight in kg, rounding to 1 decimal
 */
export function formatWeight(kg) {
  if (kg == null) return '—';
  if (kg < 1) return `${(kg * 1000).toFixed(0)} g`;
  return `${Number(kg).toFixed(1)} kg`;
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format days remaining until expiry
 * Returns 'Expired', 'Today!', 'Tomorrow', or 'N days'
 */
export function formatDaysLeft(days) {
  if (days == null) return '—';
  const d = Math.round(days);
  if (d < 0) return 'Expired';
  if (d === 0) return 'Today!';
  if (d === 1) return 'Tomorrow';
  return `${d} days`;
}

/**
 * Returns a Tailwind text color class based on a freshness score (0-100)
 * 70-100 → green, 35-69 → yellow, 0-34 → red
 */
export function getFreshnessColor(score) {
  if (score == null) return 'text-gray-400';
  if (score >= 70) return 'text-green-600';
  if (score >= 35) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Returns a Tailwind bg color class based on a freshness score (0-100)
 */
export function getFreshnessBgColor(score) {
  if (score == null) return 'bg-gray-200';
  if (score >= 70) return 'bg-green-500';
  if (score >= 35) return 'bg-yellow-400';
  return 'bg-red-500';
}

/**
 * Returns a Tailwind color based on risk level string
 */
export function getRiskColor(risk) {
  switch ((risk || '').toUpperCase()) {
    case 'HIGH':
    case 'CRITICAL':
      return 'red';
    case 'MEDIUM':
      return 'yellow';
    case 'LOW':
      return 'green';
    default:
      return 'gray';
  }
}

/**
 * Truncate text to a given length
 */
export function truncate(text, length = 80) {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '…' : text;
}

/**
 * Format a number with commas (e.g. 1000 → '1,000')
 */
export function formatNumber(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US').format(n);
}
