import { Hero } from "@/components/Hero";
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
      <FeaturedSection featured={featured} />
    </CursorLight>
  );
}
