import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { cards, getCardBySlug } from "@/data/cards";
import { formatINR, formatIncome } from "@/lib/format";
import { MetalCard } from "@/components/MetalCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return cards.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return { title: "Card not found" };
  return {
    title: card.seoTitle,
    description: card.seoDescription,
  };
}

export default async function CardDetailPage({ params }: Props) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-8">
          <MetalCard card={card} size="hero" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={card.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Apply at bank
            </a>
            <Link
              href={`/compare?ids=${card.id}`}
              className="btn-secondary"
            >
              Compare
            </Link>
          </div>
        </div>

        <div>
          <p className="section-label">{card.bankName}</p>
          <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
            {card.name}
          </h1>
          <p className="mt-3 text-lg text-silver/70">{card.bestFor}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>{card.premiumLevel}</Chip>
            <Chip>{card.category}</Chip>
            <Chip>{card.network}</Chip>
            <Chip>Score {card.scores.overall}</Chip>
          </div>

          <Section title="Fees & charges">
            <Grid
              items={[
                ["Joining", formatINR(card.fees.joiningFee)],
                ["Renewal", formatINR(card.fees.renewalFee)],
                [
                  "Waiver",
                  card.fees.waiverTarget
                    ? formatINR(card.fees.waiverTarget)
                    : "—",
                ],
                ["Forex", `${card.fees.forexMarkup}%`],
              ]}
            />
          </Section>

          <Section title="Rewards">
            <p className="text-silver/75">
              <span className="text-ice">{card.rewards.rewardName}</span> —{" "}
              {card.rewards.earnRate}
            </p>
            {card.rewards.cashbackRules.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-silver/60">
                {card.rewards.cashbackRules.map((r) => (
                  <li key={r.category} className="flex justify-between border-b border-white/5 py-2">
                    <span className="capitalize">{r.category}</span>
                    <span className="text-ice">{r.percent}%</span>
                  </li>
                ))}
              </ul>
            )}
            {card.rewards.transferPartners.length > 0 && (
              <p className="mt-3 text-sm text-silver/50">
                Partners: {card.rewards.transferPartners.join(", ")}
              </p>
            )}
          </Section>

          <Section title="Lounge & lifestyle">
            <Grid
              items={[
                ["Domestic", card.lounge.domestic],
                ["International", card.lounge.international],
                ["Priority Pass", card.lounge.priorityPass ? "Yes" : "No"],
                ["Guest access", card.lounge.guestAccess ? "Yes" : "No"],
              ]}
            />
          </Section>

          <Section title="Eligibility">
            <Grid
              items={[
                [
                  "Income",
                  formatIncome(card.eligibility.salariedMinIncome),
                ],
                ["Age", `${card.eligibility.minAge}–${card.eligibility.maxAge}`],
                ["CIBIL", `${card.eligibility.creditScore}+`],
                ["Apply", card.applyType],
              ]}
            />
            <p className="mt-3 text-sm text-silver/50">{card.eligibility.note}</p>
          </Section>

          {card.milestones.length > 0 && (
            <Section title="Milestones">
              <ul className="space-y-2 text-sm text-silver/70">
                {card.milestones.map((m) => (
                  <li key={m.spendTarget}>
                    Spend {formatINR(m.spendTarget)}/{m.frequency.toLowerCase()}{" "}
                    → {m.benefit} (~{formatINR(m.benefitValue)})
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Pros & cons">
            <div className="grid gap-4 sm:grid-cols-2">
              <ul className="space-y-2 text-sm text-silver/70">
                {card.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-brass">+</span> {p}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 text-sm text-silver/70">
                {card.cons.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="text-silver/40">−</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <p className="mt-8 text-xs text-silver/40">
            Target: {card.targetUser}.{" "}
            <Link
              href={`/banks/${card.bankId.toLowerCase()}`}
              className="text-silver/60 underline-offset-2 hover:underline"
            >
              More {card.bankName} cards
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 border-t border-white/5 pt-8">
      <h2 className="font-display text-2xl text-ice">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Grid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(([k, v]) => (
        <div
          key={k}
          className="rounded-sm border border-white/5 bg-steel/40 px-3 py-3"
        >
          <p className="text-[10px] uppercase tracking-wider text-silver/40">
            {k}
          </p>
          <p className="mt-1 text-sm text-ice">{v}</p>
        </div>
      ))}
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-white/10 px-2.5 py-1 text-xs text-silver/70">
      {children}
    </span>
  );
}
