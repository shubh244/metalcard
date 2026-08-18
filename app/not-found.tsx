import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-5 py-20 text-center">
      <p className="section-label">404</p>
      <h1 className="mt-2 font-display text-4xl text-ice">Card not forged</h1>
      <p className="mt-3 text-silver/60">That page doesn&apos;t exist.</p>
      <Link href="/cards" className="btn-primary mt-8">
        Browse cards
      </Link>
    </div>
  );
}
