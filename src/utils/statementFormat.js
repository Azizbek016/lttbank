/** Namuna PDF dagi raqam formatlari — PDF va veb bir xil */

export function formatAmount(value) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatWithdrawal(value) {
  const n = Number(value);
  if (n === 0) return '0';
  return formatAmount(n);
}

export function formatTotalBalanceLine(currency, amount) {
  const symbol = currency === 'USD' ? '$' : currency;
  return `Total balance of your account stands at ${symbol} ${formatAmount(amount)}`;
}

export function formatBalanceWords(words) {
  return `( ${words} ) US dollars`;
}

/** "Foreign Passport Full" / "Name:" qatorlari — namuna PDF tartibi */
export function splitForeignPassportName(fullName) {
  if (!fullName?.trim()) return { firstLine: '', continuation: [] };
  const lines = fullName
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length <= 1) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return { firstLine: parts[0] || '', continuation: [] };
    return { firstLine: parts[0], continuation: parts.slice(1) };
  }
  return { firstLine: lines[0], continuation: lines.slice(1) };
}
