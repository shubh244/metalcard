import type { Metadata } from "next";
import { QuizFlow } from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "Find My Card",
  description:
    "Answer a few questions about income, spend and travel to get personalised credit card matches.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <p className="section-label">Quiz</p>
        <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
          Find my card
        </h1>
        <p className="mx-auto mt-3 max-w-md text-silver/60">
          Four steps. Income, spend mix, travel and what you value most.
        </p>
      </div>
      <QuizFlow />
    </div>
  );
}
