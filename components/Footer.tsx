import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-graphite">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl text-ice">CardForge</p>
          <p className="mt-1 max-w-sm text-sm text-silver/50">
            Premium credit card offers for India — compare fees, rewards and
            lounge access before you apply.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-silver/60">
          <Link href="/cards" className="hover:text-ice">
            Browse
          </Link>
          <Link href="/quiz" className="hover:text-ice">
            Quiz
          </Link>
          <Link href="/calculator" className="hover:text-ice">
            Calculator
          </Link>
          <Link href="/compare" className="hover:text-ice">
            Compare
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-4 text-center text-xs text-silver/40">
        Illustrative data for comparison. Verify fees and benefits on the bank
        website before applying.
      </div>
    </footer>
  );
}
