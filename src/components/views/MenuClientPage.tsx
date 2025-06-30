"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { MealPlan } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowRight, Flame, Zap, Salad } from 'lucide-react';
import Link from 'next/link';

export default function MenuClientPage({ mealPlans }: { mealPlans: MealPlan[] }) {
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="py-20 text-center bg-background">
        <div className="container">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Menu Pilihan Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap hidangan dirancang oleh ahli gizi dan dibuat oleh koki profesional untuk memastikan kualitas dan rasa terbaik untuk Anda.
          </p>
        </div>
      </section>

      {/* Meal Plan Grid */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mealPlans.map((plan) => (
              <div key={plan.id} className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="relative h-56 w-full">
                  <Image 
                    src={plan.image} 
                    alt={plan.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h2>
                  <p className="text-muted-foreground mb-4 flex-grow">{plan.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-primary">
                      Rp{plan.price.toLocaleString('id-ID')}/meal
                    </p>
                    <Button variant="outline" onClick={() => setSelectedPlan(plan)}>
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Detail Plan */}
      <Dialog open={!!selectedPlan} onOpenChange={(isOpen) => !isOpen && setSelectedPlan(null)}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-6">
            <DialogTitle className="text-2xl font-bold text-primary">{selectedPlan?.name}</DialogTitle>
            <DialogDescription>{selectedPlan?.description}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-6">
            <p className="text-muted-foreground leading-relaxed">{selectedPlan?.details}</p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-secondary p-4 rounded-lg"><Zap className="mx-auto h-6 w-6 text-accent mb-2" /> <span className="font-semibold">500 Kcal</span></div>
              <div className="bg-secondary p-4 rounded-lg"><Flame className="mx-auto h-6 w-6 text-accent mb-2" /> <span className="font-semibold">40g Protein</span></div>
              <div className="bg-secondary p-4 rounded-lg"><Salad className="mx-auto h-6 w-6 text-accent mb-2" /> <span className="font-semibold">Organik</span></div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Manfaat Utama:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Meningkatkan massa otot dan pemulihan.</li>
                <li>Menjaga energi sepanjang hari.</li>
                <li>Bahan baku segar langsung dari petani lokal.</li>
              </ul>
            </div>
            <Button size="lg" className="w-full" asChild>
              <Link href="/subscription">Pilih Paket Ini <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
