import { HeroSection } from "@/components/sections/HeroSection";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { PlansPreview } from "@/components/sections/PlansPreview";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { CallToAction } from "@/components/sections/CallToAction";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsGrid />
      <PlansPreview />
      <FeaturesSection />
      <TestimonialsSection />
      <CallToAction />
    </>
  );
}