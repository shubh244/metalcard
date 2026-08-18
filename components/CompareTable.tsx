"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cards, getCardById } from "@/data/cards";
import { formatINR, formatIncome } from "@/lib/format";
import { MetalCard } from "./MetalCard";
import type { CreditCard } from "@/types/card";

type Props = {
  initialIds: string[];
};

export function CompareTable({ initialIds }: Props) {
  const [ids, setIds] = useState(() => {
    const valid = initialIds.filter((id) => getCardById(id)).slice(0, 3);
    return valid.length ? valid : [];
  });

  const selected = useMemo(
    () => ids.map((id) => getCardById(id)).filter(Boolean) as CreditCard[],
    [ids]
  );

  function setSlot(index: number, id: string) {
    setIds((prev) => {
      const next = [...prev];
      while (next.length <= index) next.push("");
      next[index] = id;
      return next.filter(Boolean).slice(0, 3);
    });
  }

  function addSlot() {
    if (ids.length >= 3) return;
    const available = cards.find((c) => !ids.includes(c.id));
    if (available) setIds([...ids, available.id]);
  }

  const rows: { label: string; render: (c: CreditCard) => string }[] = [
    { label: "Bank", render: (c) => c.bankName },
    { label: "Category", render: (c) => c.category },
    { label: "Premium", render: (c) => c.premiumLevel },
    { label: "Network", render: (c) => c.network },
    { label: "Joining fee", render: (c) => formatINR(c.fees.joiningFee) },
    { label: "Renewal fee", render: (c) => formatINR(c.fees.renewalFee) },
    {
      label: "Fee waiver",
      render: (c) =>
        c.fees.waiverTarget
          ? `Spend ${formatINR(c.fees.waiverTarget)}`
          : "—",
    },
    { label: "Forex markup", render: (c) => `${c.fees.forexMarkup}%` },
    { label: "Rewards", render: (c) => c.rewards.earnRate },
    { label: "Domestic lounge", render: (c) => c.lounge.domestic },
    { label: "International lounge", render: (c) => c.lounge.international },
    {
      label: "Min income",
      render: (c) => formatIncome(c.eligibility.salariedMinIncome),
    },
    { label: "CIBIL", render: (c) => `${c.eligibility.creditScore}+` },
    { label: "Apply", render: (c) => c.applyType },
    { label: "Overall score", render: (c) => String(c.scores.overall) },
    { label: "Best for", render: (c) => c.bestFor },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {[0, 1, 2].map((i) => (
          <select
            key={i}
            value={ids[i] ?? ""}
            onChange={(e) => {
              if (!e.target.value) {
                setIds((prev) => prev.filter((_, idx) => idx !== i));
                return;
              }
              setSlot(i, e.target.value);
            }}
            className="min-w-[200px] flex-1 rounded-sm border border-white/10 bg-steel/80 px-3 py-2.5 text-sm text-ice focus:border-brass/50 focus:outline-none"
          >
            <option value="">
              {i === 0 ? "Select card…" : `Slot ${i + 1} (optional)`}
            </option>
            {cards.map((c) => (
              <option key={c.id} value={c.id} disabled={ids.includes(c.id) && ids[i] !== c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ))}
        {ids.length < 3 && ids.length > 0 && (
          <button type="button" onClick={addSlot} className="btn-secondary !py-2.5 text-xs">
            Add card
          </button>
        )}
      </div>

      {selected.length < 2 ? (
        <div className="metal-panel rounded-lg p-10 text-center text-silver/60">
          Select at least two cards to compare side by side.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-graphite p-3 text-left text-xs font-medium uppercase tracking-wider text-silver/40">
                  Feature
                </th>
                {selected.map((c) => (
                  <th key={c.id} className="p-3 text-left align-top">
                    <div className="mx-auto mb-3 max-w-[200px]">
                      <MetalCard card={c} size="sm" interactive={false} />
                    </div>
                    <Link
                      href={`/cards/${c.slug}`}
                      className="font-display text-lg text-ice hover:text-white"
                    >
                      {c.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-white/5">
                  <td className="sticky left-0 bg-graphite p-3 text-silver/50">
                    {row.label}
                  </td>
                  {selected.map((c) => (
                    <td key={c.id} className="p-3 text-ice/90">
                      {row.render(c)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-white/5">
                <td className="sticky left-0 bg-graphite p-3" />
                {selected.map((c) => (
                  <td key={c.id} className="p-3">
                    <a
                      href={c.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary !px-4 !py-2 text-xs"
                    >
                      Apply
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
