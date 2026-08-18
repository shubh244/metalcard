export function formatINR(amount: number): string {
  if (amount === 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIncome(monthly: number | null): string {
  if (monthly == null) return "Relationship-based";
  if (monthly >= 100000) return `₹${(monthly / 100000).toFixed(monthly % 100000 === 0 ? 0 : 1)}L+/mo`;
  return `${formatINR(monthly)}/mo`;
}

export function slugifyBank(bankId: string): string {
  return bankId.toLowerCase();
}
