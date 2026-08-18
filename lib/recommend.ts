import { cards } from "@/data/cards";
import type { CreditCard, QuizAnswers } from "@/types/card";

export function recommendCards(answers: QuizAnswers, limit = 4): CreditCard[] {
  const scored = cards.map((card) => ({
    card,
    score: scoreCard(card, answers),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.card);
}

function scoreCard(card: CreditCard, a: QuizAnswers): number {
  let score = card.scores.overall * 0.35;

  const incomeOk =
    card.eligibility.salariedMinIncome == null ||
    a.monthlyIncome >= card.eligibility.salariedMinIncome * 0.85;
  if (!incomeOk) score -= 25;
  else score += 5;

  const totalSpend =
    a.onlineSpend + a.foodSpend + a.travelSpend + a.fuelSpend + a.shoppingSpend;

  if (a.preferredBenefit === "cashback") {
    score += card.scores.cashback * 4;
    score += a.onlineSpend > 15000 ? card.scores.cashback : 0;
  } else if (a.preferredBenefit === "travel") {
    score += card.scores.travel * 4;
  } else if (a.preferredBenefit === "lounge") {
    score += card.scores.travel * 2.5 + card.scores.lifestyle * 1.5;
    if (card.lounge.priorityPass) score += 8;
    if (card.lounge.domestic.toLowerCase().includes("unlimited")) score += 6;
  } else if (a.preferredBenefit === "lifestyle") {
    score += card.scores.lifestyle * 4;
  } else {
    score +=
      (card.scores.cashback + card.scores.travel + card.scores.value) * 1.2;
  }

  if (a.travelFrequency === "frequent") score += card.scores.travel * 2;
  if (a.travelFrequency === "occasional") score += card.scores.travel * 0.8;
  if (a.travelFrequency === "none") score += card.scores.cashback * 0.5;

  if (a.foodSpend / Math.max(totalSpend, 1) > 0.25 && card.coBrand === "Swiggy")
    score += 12;
  if (a.shoppingSpend > 20000) {
    if (card.coBrand === "Amazon" || card.coBrand === "Flipkart") score += 10;
  }
  if (a.onlineSpend > 25000 && card.scores.cashback >= 9) score += 8;

  if (a.monthlyIncome < 50000) score += card.scores.beginner * 1.5;
  if (a.monthlyIncome > 150000 && card.premiumLevel === "Super Premium")
    score += 6;

  score += card.scores.value * 1.5;
  return score;
}
