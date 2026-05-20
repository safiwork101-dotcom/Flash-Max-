import { SiteShell } from "@/components/SiteShell";
import { GeneratorSection } from "@/components/sections/GeneratorSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";

export default function Home() {
  return (
    <SiteShell>
      <HeroSection />
      <GeneratorSection />
      <ReviewsSection />
    </SiteShell>
  );
}
