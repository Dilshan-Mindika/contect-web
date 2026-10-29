/**
 * CONTEC Enterprise ERP - Sri Lankan Rupee (LKR) Currency Engine
 * Standardized across all executive, engineering, procurement, and financial modules.
 */

export const CURRENCY_CODE = 'LKR';
export const CURRENCY_SYMBOL = 'Rs.';

/**
 * Format a number as LKR (e.g. "LKR 1,450,000" or "Rs. 1,450,000")
 */
export function formatLKR(amount: number | null | undefined, compact = false): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'LKR 0';
  }

  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 1_000_000_000) {
      return `LKR ${(amount / 1_000_000_000).toFixed(2)}B`;
    }
    if (abs >= 1_000_000) {
      return `LKR ${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (abs >= 1_000) {
      return `LKR ${(amount / 1_000).toFixed(1)}K`;
    }
    return `LKR ${amount.toLocaleString()}`;
  }

  return `LKR ${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Format precise amount with two decimal cents (e.g. "LKR 1,450,000.00")
 */
export function formatLKRFull(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'LKR 0.00';
  }
  return `LKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format unit rates (e.g. "LKR 38,500 / m³")
 */
export function formatLKRUnit(amount: number, unit: string): string {
  return `${formatLKR(amount)} / ${unit}`;
}

