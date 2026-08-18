import { cards } from "@/data/cards";
import type {
  CardValueBreakdown,
  CreditCard,
  SpendInput,
} from "@/types/card";

const CATEGORY_KEYS = [
  "online",
  "food",
  "travel",
  "fuel",
  "shopping",
  "other",
] as const;

export function calculateCardValue(
  card: CreditCard,
  monthly: SpendInput
): CardValueBreakdown {
  const annual = {
    online: monthly.online * 12,
    food: monthly.food * 12,
    travel: monthly.travel * 12,
    fuel: monthly.fuel * 12,
    shopping: monthly.shopping * 12,
    other: monthly.other * 12,
  };

  const breakdown: CardValueBreakdown["breakdown"] = [];
  let grossRewards = 0;

  for (const key of CATEGORY_KEYS) {
    const amount = annual[key];
    if (amount <= 0) continue;
    const earned = earnForCategory(card, key, amount);
    breakdown.push({ category: key, amount, earned });
    grossRewards += earned;
  }

  const fees = card.fees.renewalFee;
  const waiver =
    card.fees.renewalWaiver &&
    card.fees.waiverTarget != null &&
    Object.values(annual).reduce((s, v) => s + v, 0) >= card.fees.waiverTarget;
  const effectiveFees = waiver ? 0 : fees;

  return {
    card,
    grossRewards: Math.round(grossRewards),
    fees: effectiveFees,
    netBenefit: Math.round(grossRewards - effectiveFees),
    breakdown,
  };
}

function earnForCategory(
  card: CreditCard,
  category: (typeof CATEGORY_KEYS)[number],
  amount: number
): number {
  const rule = card.rewards.cashbackRules.find((r) => r.category === category);
  if (rule) {
    return (amount * rule.percent) / 100;
  }

  // Points/miles heuristic: earnRateNumeric as ₹ per ₹100 * redemption value
  const pointsPerHundred = card.rewards.earnRateNumeric;
  const points = (amount / 100) * pointsPerHundred;
  let multiplier = 1;
  if (category === "travel" && card.category === "Travel") multiplier = 1.4;
  if (category === "food" && card.category === "Dining") multiplier = 1.5;
  if (category === "shopping" && card.category === "Shopping") multiplier = 1.3;
  return points * card.rewards.redemptionValue * multiplier;
}

export function rankCardsByValue(
  monthly: SpendInput,
  limit = 3
): CardValueBreakdown[] {
  return cards
    .map((c) => calculateCardValue(c, monthly))
    .sort((a, b) => b.netBenefit - a.netBenefit)
    .slice(0, limit);
}
