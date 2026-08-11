export function getCurrencySymbol(): string {
  return localStorage.getItem('currencySymbol') || '₦';
}

export function getCurrencyCode(): string {
  return localStorage.getItem('currencyCode') || 'NGN';
}

export function formatCurrency(amount: number): string {
  const symbol = getCurrencySymbol();
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
