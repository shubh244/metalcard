"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cards } from "@/data/cards";
import type { CardCategory, PremiumLevel } from "@/types/card";
import { CardTile } from "./CardTile";

const categories: Array<CardCategory | "All"> = [
  "All",
  "Travel",
  "Cashback",
  "Shopping",
  "Lifestyle",
  "Dining",
  "Fuel",
  "Business",
];

const premiums: Array<PremiumLevel | "All"> = [
  "All",
  "Super Premium",
  "Premium",
  "Mass Premium",
  "Entry",
];

export function CardCatalog() {
  const [q, setQ] = useState("");
  const [bank, setBank] = useState("All");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [premium, setPremium] = useState<(typeof premiums)[number]>("All");
  const [zeroFee, setZeroFee] = useState(false);
  const [lounge, setLounge] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const banks = useMemo(() => {
    const set = new Set(cards.map((c) => c.bankName));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      if (bank !== "All" && c.bankName !== bank) return false;
      if (category !== "All" && c.category !== category) return false;
      if (premium !== "All" && c.premiumLevel !== premium) return false;
      if (zeroFee && c.fees.joiningFee !== 0) return false;
      if (
        lounge &&
        !c.lounge.priorityPass &&
        !c.lounge.domestic.toLowerCase().includes("unlimited") &&
        c.lounge.international.toLowerCase() !== "yes" &&
        !c.lounge.international.toLowerCase().includes("unlimited")
      )
        return false;
      if (q.trim()) {
        const s = q.toLowerCase();
        const hay = `${c.name} ${c.bankName} ${c.coBrand ?? ""} ${c.bestFor}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [q, bank, category, premium, zeroFee, lounge]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  return (
    <div>
      <div className="metal-panel mb-8 space-y-4 rounded-lg p-4 sm:p-5">
        <input
          type="search"
          placeholder="Search cards, banks, brands…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-graphite/60 px-4 py-3 text-sm text-ice placeholder:text-silver/40 focus:border-brass/50 focus:outline-none"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Bank"
            value={bank}
            onChange={setBank}
            options={banks}
          />
          <Select
            label="Category"
            value={category}
            onChange={(v) => setCategory(v as typeof category)}
            options={categories}
          />
          <Select
            label="Premium"
            value={premium}
            onChange={(v) => setPremium(v as typeof premium)}
            options={premiums}
          />
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm text-silver/70">
              <input
                type="checkbox"
                checked={zeroFee}
                onChange={(e) => setZeroFee(e.target.checked)}
                className="accent-brass"
              />
              Zero joining fee
            </label>
            <label className="flex items-center gap-2 text-sm text-silver/70">
              <input
                type="checkbox"
                checked={lounge}
                onChange={(e) => setLounge(e.target.checked)}
                className="accent-brass"
              />
              Strong lounge access
            </label>
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-silver/50">
        {filtered.length} card{filtered.length === 1 ? "" : "s"}
        {compareIds.length > 0 && (
          <span className="ml-2 text-brass">
            · {compareIds.length}/3 selected
          </span>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="metal-panel rounded-lg p-10 text-center text-silver/60">
          No cards match these filters. Try clearing search or fee filters.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((card, i) => (
            <CardTile
              key={card.id}
              card={card}
              index={i}
              selected={compareIds.includes(card.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      {compareIds.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <Link
            href={`/compare?ids=${compareIds.join(",")}`}
            className="btn-primary shadow-metal"
          >
            Compare {compareIds.length} cards
          </Link>
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block text-xs text-silver/50">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-white/10 bg-graphite/60 px-3 py-2.5 text-sm text-ice focus:border-brass/50 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
