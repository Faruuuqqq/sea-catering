import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ContactSection from '@/components/sections/ContactSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export default async function HomePage() {
  const session = await auth();

  return (
    <main>
      <HeroSection session={session} />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}