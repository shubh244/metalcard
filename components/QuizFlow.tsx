"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { recommendCards } from "@/lib/recommend";
import { formatINR } from "@/lib/format";
import type { QuizAnswers } from "@/types/card";
import { MetalCard } from "./MetalCard";

const steps = ["Income", "Spend", "Travel", "Preference"] as const;

const defaultAnswers: QuizAnswers = {
  monthlyIncome: 80000,
  onlineSpend: 25000,
  foodSpend: 10000,
  travelSpend: 15000,
  fuelSpend: 5000,
  shoppingSpend: 15000,
  travelFrequency: "occasional",
  preferredBenefit: "balanced",
};

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(defaultAnswers);
  const [done, setDone] = useState(false);

  const results = done ? recommendCards(answers, 4) : [];

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="mx-auto max-w-xl">
      {!done && (
        <div className="mb-8 flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                i <= step ? "bg-brass" : "bg-white/10"
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div>
              <p className="section-label">Your matches</p>
              <h2 className="mt-2 font-display text-3xl text-ice">
                Top cards for your profile
              </h2>
            </div>
            <div className="space-y-4">
              {results.map((card, i) => (
                <Link
                  key={card.id}
                  href={`/cards/${card.slug}`}
                  className="metal-panel flex gap-4 rounded-lg p-4 transition hover:border-brass/30"
                >
                  <div className="w-28 shrink-0 sm:w-36">
                    <MetalCard card={card} size="sm" interactive={false} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-brass">#{i + 1}</p>
                    <p className="font-display text-xl text-ice">{card.name}</p>
                    <p className="mt-1 text-sm text-silver/60">{card.bestFor}</p>
                    <p className="mt-2 text-xs text-silver/40">
                      Fee {formatINR(card.fees.joiningFee)} · Score{" "}
                      {card.scores.overall}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={back} className="btn-secondary">
                Retake quiz
              </button>
              <Link href="/calculator" className="btn-primary">
                Estimate annual value
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="metal-panel rounded-lg p-6 sm:p-8"
          >
            <p className="section-label">
              Step {step + 1} · {steps[step]}
            </p>

            {step === 0 && (
              <div className="mt-4 space-y-4">
                <h2 className="font-display text-2xl text-ice">
                  Monthly income
                </h2>
                <Range
                  label="Income"
                  value={answers.monthlyIncome}
                  min={20000}
                  max={300000}
                  step={5000}
                  onChange={(v) =>
                    setAnswers((a) => ({ ...a, monthlyIncome: v }))
                  }
                />
              </div>
            )}

            {step === 1 && (
              <div className="mt-4 space-y-4">
                <h2 className="font-display text-2xl text-ice">
                  Typical monthly spend
                </h2>
                <Range
                  label="Online"
                  value={answers.onlineSpend}
                  min={0}
                  max={80000}
                  step={1000}
                  onChange={(v) =>
                    setAnswers((a) => ({ ...a, onlineSpend: v }))
                  }
                />
                <Range
                  label="Food"
                  value={answers.foodSpend}
                  min={0}
                  max={40000}
                  step={1000}
                  onChange={(v) => setAnswers((a) => ({ ...a, foodSpend: v }))}
                />
                <Range
                  label="Travel"
                  value={answers.travelSpend}
                  min={0}
                  max={80000}
                  step={1000}
                  onChange={(v) =>
                    setAnswers((a) => ({ ...a, travelSpend: v }))
                  }
                />
                <Range
                  label="Shopping"
                  value={answers.shoppingSpend}
                  min={0}
                  max={60000}
                  step={1000}
                  onChange={(v) =>
                    setAnswers((a) => ({ ...a, shoppingSpend: v }))
                  }
                />
                <Range
                  label="Fuel"
                  value={answers.fuelSpend}
                  min={0}
                  max={20000}
                  step={500}
                  onChange={(v) => setAnswers((a) => ({ ...a, fuelSpend: v }))}
                />
              </div>
            )}

            {step === 2 && (
              <div className="mt-4 space-y-4">
                <h2 className="font-display text-2xl text-ice">
                  How often do you travel?
                </h2>
                <div className="grid gap-2">
                  {(
                    [
                      ["none", "Rarely / never"],
                      ["occasional", "A few trips a year"],
                      ["frequent", "Frequent flyer"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({ ...a, travelFrequency: value }))
                      }
                      className={`rounded-sm border px-4 py-3 text-left text-sm transition ${
                        answers.travelFrequency === value
                          ? "border-brass bg-brass/10 text-ice"
                          : "border-white/10 text-silver hover:border-white/25"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-4 space-y-4">
                <h2 className="font-display text-2xl text-ice">
                  What matters most?
                </h2>
                <div className="grid gap-2">
                  {(
                    [
                      ["cashback", "Cashback"],
                      ["travel", "Travel rewards / miles"],
                      ["lounge", "Airport lounges"],
                      ["lifestyle", "Lifestyle & dining"],
                      ["balanced", "Balanced mix"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({ ...a, preferredBenefit: value }))
                      }
                      className={`rounded-sm border px-4 py-3 text-left text-sm transition ${
                        answers.preferredBenefit === value
                          ? "border-brass bg-brass/10 text-ice"
                          : "border-white/10 text-silver hover:border-white/25"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between gap-3">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="btn-secondary disabled:opacity-30"
              >
                Back
              </button>
              <button type="button" onClick={next} className="btn-primary">
                {step === steps.length - 1 ? "See matches" : "Continue"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-silver/70">{label}</span>
        <span className="text-ice">{formatINR(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brass"
      />
    </label>
  );
}
