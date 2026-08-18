export type CardStatus = "Active" | "Discontinued";
export type PremiumLevel = "Super Premium" | "Premium" | "Mass Premium" | "Entry";
export type CardCategory =
  | "Travel"
  | "Cashback"
  | "Fuel"
  | "Shopping"
  | "Lifestyle"
  | "Business"
  | "Dining";
export type CardNetwork = "Visa" | "Mastercard" | "RuPay" | "Amex";
export type ApplyType = "Self" | "Invite" | "Existing Customer" | "Invite/Self";
export type RewardType = "Points" | "Cashback" | "Miles";

export interface CardFees {
  joiningFee: number;
  renewalFee: number;
  gstApplicable: boolean;
  renewalWaiver: boolean;
  waiverTarget: number | null;
  forexMarkup: number;
  addOnCardFee: number;
}

export interface CardRewards {
  rewardType: RewardType;
  rewardName: string;
  earnRate: string;
  earnRateNumeric: number;
  redemptionValue: number;
  transferPartners: string[];
  expiry: string;
  bonusPoints: string;
  cashbackRules: { category: string; percent: number }[];
}

export interface CardLounge {
  domestic: string;
  international: string;
  priorityPass: boolean;
  guestAccess: boolean;
}

export interface CardEligibility {
  minAge: number;
  maxAge: number;
  salariedMinIncome: number | null;
  selfEmployedNote: string;
  creditScore: number;
  note: string;
}

export interface CardMilestone {
  spendTarget: number;
  benefit: string;
  benefitValue: number;
  frequency: "Annual" | "Monthly" | "Quarterly";
}

export interface CardScores {
  overall: number;
  reward: number;
  travel: number;
  cashback: number;
  lifestyle: number;
  beginner: number;
  value: number;
}

export interface CreditCard {
  id: string;
  bankId: string;
  bankName: string;
  name: string;
  slug: string;
  status: CardStatus;
  category: CardCategory;
  premiumLevel: PremiumLevel;
  network: CardNetwork;
  variant: string;
  coBrand: string | null;
  applyType: ApplyType;
  targetUser: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  fees: CardFees;
  rewards: CardRewards;
  lounge: CardLounge;
  eligibility: CardEligibility;
  milestones: CardMilestone[];
  scores: CardScores;
  metalTone: "graphite" | "gold" | "silver" | "obsidian" | "rose" | "blue";
  applyUrl: string;
  seoTitle: string;
  seoDescription: string;
}

export interface QuizAnswers {
  monthlyIncome: number;
  onlineSpend: number;
  foodSpend: number;
  travelSpend: number;
  fuelSpend: number;
  shoppingSpend: number;
  travelFrequency: "none" | "occasional" | "frequent";
  preferredBenefit: "cashback" | "travel" | "lounge" | "lifestyle" | "balanced";
}

export interface SpendInput {
  online: number;
  food: number;
  travel: number;
  fuel: number;
  shopping: number;
  other: number;
}

export interface CardValueBreakdown {
  card: CreditCard;
  grossRewards: number;
  fees: number;
  netBenefit: number;
  breakdown: { category: string; amount: number; earned: number }[];
}
