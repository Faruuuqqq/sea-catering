import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-cream">
      <Badge className="bg-green-100 text-dark-green px-4 py-1 font-semibold mb-6 shadow-sm">
        <TrendingUp className="h-4 w-4 mr-2" />
        Layanan Makanan Sehat Terpopuler di Indonesia
      </Badge>
      <h1 className="text-5xl md:text-7xl font-black text-dark-green mb-6">
        Healthy Meals, <br /> That Actually Taste Good
      </h1>
      <p className="text-lg md:text-xl text-text-main/80 max-w-3xl mx-auto mb-8">
        Kami merevolusi makanan sehat di Indonesia dengan personalisasi makanan bertenaga AI. Setiap hidangan dibuat oleh koki top, dioptimalkan oleh ahli gizi, dan diantar segar ke rumah Anda.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
          <Link href="/menu">Jelajahi Menu <ArrowRight className="ml-2 h-5 w-5" /></Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/subscription">Mulai Berlangganan</Link>
        </Button>
      </div>
    </section>
  );
};