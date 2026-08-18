import type { Metadata } from "next";
import { CompareTable } from "@/components/CompareTable";

export const metadata: Metadata = {
  title: "Compare Credit Cards",
  description:
    "Side-by-side comparison of fees, rewards, lounge access and eligibility.",
};

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function ComparePage({ searchParams }: Props) {
  const { ids: idsParam } = await searchParams;
  const initialIds = idsParam
    ? idsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="mb-10 max-w-xl">
        <p className="section-label">Compare</p>
        <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
          Side by side
        </h1>
        <p className="mt-3 text-silver/60">
          Pick up to three cards and line up fees, rewards and lounges.
        </p>
      </div>
      <CompareTable initialIds={initialIds} />
    </div>
  );
}
