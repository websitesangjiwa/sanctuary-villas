/**
 * Format price with currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: "USD")
 * @param showDecimals - Whether to show decimal places (default: false for whole numbers)
 */
export function formatPrice(
  amount: number | string,
  currency: string = "USD",
  showDecimals: boolean = false
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numAmount);
}

/**
 * Parse date string to Date object without timezone shift
 * Adds T12:00:00 to avoid timezone issues
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T12:00:00");
}
