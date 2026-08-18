"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { rankCardsByValue } from "@/lib/calculate";
import { formatINR } from "@/lib/format";
import type { SpendInput } from "@/types/card";
import { MetalCard } from "./MetalCard";

const defaults: SpendInput = {
  online: 25000,
  food: 10000,
  travel: 15000,
  fuel: 5000,
  shopping: 15000,
  other: 10000,
};

export function CalculatorForm() {
  const [spend, setSpend] = useState<SpendInput>(defaults);
  const results = useMemo(() => rankCardsByValue(spend, 3), [spend]);

  const annualTotal =
    (spend.online +
      spend.food +
      spend.travel +
      spend.fuel +
      spend.shopping +
      spend.other) *
    12;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="metal-panel h-fit rounded-lg p-6">
        <p className="section-label">Monthly spend</p>
        <h2 className="mt-2 font-display text-2xl text-ice">
          Estimate net annual value
        </h2>
        <p className="mt-2 text-sm text-silver/55">
          Approximate rewards minus renewal fee (waiver applied when spend
          qualifies).
        </p>
        <div className="mt-6 space-y-4">
          {(
            [
              ["online", "Online"],
              ["food", "Food"],
              ["travel", "Travel"],
              ["shopping", "Shopping"],
              ["fuel", "Fuel"],
              ["other", "Other"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-silver/70">{label}</span>
                <span className="text-ice">{formatINR(spend[key])}</span>
              </div>
              <input
                type="range"
                min={0}
                max={key === "fuel" ? 20000 : 80000}
                step={1000}
                value={spend[key]}
                onChange={(e) =>
                  setSpend((s) => ({ ...s, [key]: Number(e.target.value) }))
                }
                className="w-full accent-brass"
              />
            </label>
          ))}
        </div>
        <p className="mt-6 text-sm text-silver/50">
          Annual spend ≈{" "}
          <span className="text-ice">{formatINR(annualTotal)}</span>
        </p>
      </div>

      <div className="space-y-4">
        <p className="section-label">Top 3 for your spend</p>
        {results.map((r, i) => (
          <div key={r.card.id} className="metal-panel rounded-lg p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="w-full max-w-[180px] shrink-0">
                <MetalCard card={r.card} size="sm" interactive={false} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-brass">#{i + 1}</p>
                <Link
                  href={`/cards/${r.card.slug}`}
                  className="font-display text-2xl text-ice hover:text-white"
                >
                  {r.card.name}
                </Link>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <Stat label="Rewards" value={formatINR(r.grossRewards)} />
                  <Stat label="Fees" value={formatINR(r.fees)} />
                  <Stat
                    label="Net benefit"
                    value={formatINR(r.netBenefit)}
                    highlight
                  />
                </div>
                <ul className="mt-4 space-y-1 text-xs text-silver/50">
                  {r.breakdown
                    .filter((b) => b.earned > 0)
                    .slice(0, 4)
                    .map((b) => (
                      <li key={b.category} className="flex justify-between">
                        <span className="capitalize">{b.category}</span>
                        <span>{formatINR(b.earned)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-sm border border-white/5 bg-graphite/40 px-2 py-3">
      <p className="text-[10px] uppercase tracking-wider text-silver/40">
        {label}
      </p>
      <p className={`mt-1 text-sm ${highlight ? "text-brass" : "text-ice"}`}>
        {value}
      </p>
    </div>
  );
}
