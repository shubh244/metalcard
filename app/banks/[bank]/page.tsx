import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBanks, getCardsByBank } from "@/data/cards";
import { CardTile } from "@/components/CardTile";

type Props = { params: Promise<{ bank: string }> };

export async function generateStaticParams() {
  return getBanks().map((b) => ({ bank: b.id.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bank } = await params;
  const list = getCardsByBank(bank);
  if (!list.length) return { title: "Bank not found" };
  return {
    title: `${list[0].bankName} Credit Cards`,
    description: `Compare ${list[0].bankName} credit card offers — fees, rewards and lounge access.`,
  };
}

export default async function BankPage({ params }: Props) {
  const { bank } = await params;
  const list = getCardsByBank(bank);
  if (!list.length) notFound();
  const bankName = list[0].bankName;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="mb-10 max-w-xl">
        <p className="section-label">Bank</p>
        <h1 className="mt-2 font-display text-4xl text-ice sm:text-5xl">
          {bankName}
        </h1>
        <p className="mt-3 text-silver/60">
          {list.length} card{list.length === 1 ? "" : "s"} in the CardForge
          catalog.{" "}
          <Link href="/cards" className="text-brass hover:underline">
            Browse all
          </Link>
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((card, i) => (
          <CardTile key={card.id} card={card} index={i} />
        ))}
      </div>
    </div>
  );
}
