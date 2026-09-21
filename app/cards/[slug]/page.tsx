import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { cards, getCardBySlug } from "@/data/cards";
import { formatINR, formatIncome } from "@/lib/format";
import { getCardTheme, themeStyle } from "@/lib/cardTheme";
import { ProductCard } from "@/components/ProductCard";

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

  const theme = getCardTheme(card);
  const style = themeStyle(card) as CSSProperties;

  return (
    <div className="relative min-h-[70vh] overflow-hidden" style={style}>
      {/* Atmosphere synced to this card's face palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 75% 55% at 72% 8%, ${theme.glow}, transparent 58%),
            radial-gradient(ellipse 45% 40% at 8% 35%, ${theme.pageTint}, transparent 55%),
            linear-gradient(180deg, ${theme.from}22 0%, transparent 42%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 -z-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: theme.glow }}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <nav className="mb-8 text-xs text-silver/45">
          <Link href="/cards" className="hover:text-silver">
            Cards
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/banks/${card.bankId.toLowerCase()}`}
            className="hover:text-silver"
          >
            {card.bankName}
          </Link>
          <span className="mx-2">/</span>
          <span style={{ color: theme.label }}>{card.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            {/* Product showcase — face art drives page theme */}
            <div
              className="relative overflow-hidden rounded-2xl px-5 py-8 sm:px-8 sm:py-10"
              style={{
                background: `linear-gradient(160deg, ${theme.panel}, ${theme.from}33)`,
                boxShadow: `0 28px 56px -18px rgba(0,0,0,0.55), 0 0 0 1px ${theme.accent}33`,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${theme.glow}, transparent 70%)`,
                }}
              />
              <div className="relative mx-auto flex justify-center">
                <ProductCard card={card} size="hero" interactive />
              </div>
              <p
                className="relative mt-6 text-center text-[10px] uppercase tracking-[0.2em]"
                style={{ color: theme.label }}
              >
                {card.network} · {card.premiumLevel}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={card.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ backgroundColor: theme.accent, color: "#0b0d10" }}
              >
                Apply at bank
              </a>
              <Link href={`/compare?ids=${card.id}`} className="btn-secondary">
                Compare
              </Link>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-silver/40">
              Product art is original CardForge styling synced to this card’s
              palette — not a bank scan. Fees and benefits change; verify on the
              official bank site before applying.
            </p>
          </div>

          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: theme.label }}
            >
              {card.bankName}
              {card.coBrand ? ` · ${card.coBrand}` : ""}
            </p>
            <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
              {card.name}
            </h1>
            <p className="mt-3 text-lg text-silver/70">{card.bestFor}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip accent={theme.accent}>{card.premiumLevel}</Chip>
              <Chip accent={theme.accent}>{card.category}</Chip>
              <Chip accent={theme.accent}>{card.network}</Chip>
              <Chip accent={theme.accent}>Score {card.scores.overall}</Chip>
            </div>

            <Section title="At a glance" accent={theme.accent}>
              <ul className="space-y-2">
                {card.pros.slice(0, 4).map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-silver/75">
                    <span style={{ color: theme.accent }}>●</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Fees & charges" accent={theme.accent}>
              <Grid
                accent={theme.accentSoft}
                items={[
                  ["Joining", formatINR(card.fees.joiningFee)],
                  ["Renewal", formatINR(card.fees.renewalFee)],
                  [
                    "Fee waiver",
                    card.fees.waiverTarget
                      ? formatINR(card.fees.waiverTarget)
                      : "—",
                  ],
                  ["Forex", `${card.fees.forexMarkup}%`],
                ]}
              />
            </Section>

            <Section title="Rewards" accent={theme.accent}>
              <p className="text-silver/75">
                <span className="text-ice">{card.rewards.rewardName}</span> —{" "}
                {card.rewards.earnRate}
              </p>
              {card.rewards.cashbackRules.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-silver/60">
                  {card.rewards.cashbackRules.map((r) => (
                    <li
                      key={r.category}
                      className="flex justify-between border-b border-white/5 py-2"
                    >
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
              {card.rewards.bonusPoints && (
                <p className="mt-2 text-sm text-silver/50">
                  Welcome: {card.rewards.bonusPoints}
                </p>
              )}
            </Section>

            <Section title="Lounge & lifestyle" accent={theme.accent}>
              <Grid
                accent={theme.accentSoft}
                items={[
                  ["Domestic", card.lounge.domestic],
                  ["International", card.lounge.international],
                  [
                    "Priority Pass",
                    card.lounge.priorityPass ? "Yes" : "No",
                  ],
                  ["Guest access", card.lounge.guestAccess ? "Yes" : "No"],
                ]}
              />
            </Section>

            <Section title="Eligibility" accent={theme.accent}>
              <Grid
                accent={theme.accentSoft}
                items={[
                  [
                    "Income",
                    formatIncome(card.eligibility.salariedMinIncome),
                  ],
                  [
                    "Age",
                    `${card.eligibility.minAge}–${card.eligibility.maxAge}`,
                  ],
                  ["CIBIL", `${card.eligibility.creditScore}+`],
                  ["Apply", card.applyType],
                ]}
              />
              <p className="mt-3 text-sm text-silver/50">
                {card.eligibility.note}
              </p>
            </Section>

            {card.milestones.length > 0 && (
              <Section title="Milestones" accent={theme.accent}>
                <ul className="space-y-2 text-sm text-silver/70">
                  {card.milestones.map((m) => (
                    <li key={m.spendTarget}>
                      Spend {formatINR(m.spendTarget)}/
                      {m.frequency.toLowerCase()} → {m.benefit} (~
                      {formatINR(m.benefitValue)})
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section title="Pros & cons" accent={theme.accent}>
              <div className="grid gap-4 sm:grid-cols-2">
                <ul className="space-y-2 text-sm text-silver/70">
                  {card.pros.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span style={{ color: theme.accent }}>+</span> {p}
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

            <Section title="Score breakdown" accent={theme.accent}>
              <Grid
                accent={theme.accentSoft}
                items={[
                  ["Overall", String(card.scores.overall)],
                  ["Travel", String(card.scores.travel)],
                  ["Cashback", String(card.scores.cashback)],
                  ["Value", String(card.scores.value)],
                ]}
              />
            </Section>

            <p className="mt-10 text-xs text-silver/40">
              Built for {card.targetUser}.{" "}
              <Link
                href={`/banks/${card.bankId.toLowerCase()}`}
                className="underline-offset-2 hover:underline"
                style={{ color: theme.label }}
              >
                More {card.bankName} cards
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  accent,
}: {
  title: string;
  children: ReactNode;
  accent: string;
}) {
  return (
    <section className="mt-10 border-t border-white/5 pt-8">
      <h2 className="font-display text-2xl text-ice">
        <span
          className="mr-2 inline-block h-2 w-2 rounded-full align-middle"
          style={{ backgroundColor: accent }}
        />
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Grid({
  items,
  accent,
}: {
  items: [string, string][];
  accent: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(([k, v]) => (
        <div
          key={k}
          className="rounded-sm border border-white/5 px-3 py-3"
          style={{ background: accent }}
        >
          <p className="text-[10px] uppercase tracking-wider text-silver/45">
            {k}
          </p>
          <p className="mt-1 text-sm text-ice">{v}</p>
        </div>
      ))}
    </div>
  );
}

function Chip({
  children,
  accent,
}: {
  children: ReactNode;
  accent: string;
}) {
  return (
    <span
      className="rounded-sm border px-2.5 py-1 text-xs text-silver/80"
      style={{ borderColor: `${accent}55` }}
    >
      {children}
    </span>
  );
}
