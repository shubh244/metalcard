import type { Metadata } from "next";
import { CalculatorForm } from "@/components/CalculatorForm";

export const metadata: Metadata = {
  title: "Reward Calculator",
  description:
    "Estimate annual net benefit across CardForge cards based on your monthly spend.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="mb-10 max-w-xl">
        <p className="section-label">Calculator</p>
        <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
          Reward value
        </h1>
        <p className="mt-3 text-silver/60">
          Model your monthly spend and see which cards return the most after
          fees.
        </p>
      </div>
      <CalculatorForm />
    </div>
  );
}
