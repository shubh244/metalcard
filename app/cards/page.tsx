import type { Metadata } from "next";
import { CardCatalog } from "@/components/CardCatalog";

export const metadata: Metadata = {
  title: "Browse Credit Cards",
  description:
    "Filter India's premium credit cards by bank, category, fee and lounge access.",
};

export default function CardsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="mb-10 max-w-xl">
        <p className="section-label">Catalog</p>
        <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
          Browse cards
        </h1>
        <p className="mt-3 text-silver/60">
          Search and filter offers, then select up to three to compare.
        </p>
      </div>
      <CardCatalog />
    </div>
  );
}
