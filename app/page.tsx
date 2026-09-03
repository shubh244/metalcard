import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedSection } from "@/components/FeaturedSection";
import { CursorLight } from "@/components/CursorLight";
import { cards } from "@/data/cards";

export default function HomePage() {
  const featured = [...cards]
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, 3);

  return (
    <CursorLight>
      <Hero />
      <HowItWorks />
      <FeaturedSection featured={featured} />
    </CursorLight>
  );
}
