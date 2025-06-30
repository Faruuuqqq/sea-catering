import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Award } from "lucide-react";

import { getMealPlans } from '@/lib/actions/subscription.actions';

export const PlansPreview = async () => {
  const mealPlans = await getMealPlans();
  const displayPlans = mealPlans.map(plan => {
    if (plan.name === "Protein Plan") {
      return {
        ...plan,
        popular: true,
        perks: [
          "Jaminan protein 40g+ per porsi",
          "Pengaturan waktu makan sebelum & sesudah latihan",
          "Nutrisi yang berfokus pada pemulihan",
        ]
      };
    }
    if (plan.name === "Diet Plan") {
        return {
            ...plan,
            popular: false,
            perks: [
                "Optimalisasi kalori bertenaga AI",
                "Perencanaan makan peningkat metabolisme",
                "Analitik kemajuan mingguan",
            ]
        }
    }
    return {
        ...plan,
        popular: false,
        perks: [
          "Hidangan khas koki selebriti",
          "Bahan-bahan impor premium",
          "Presentasi berkualitas restoran",
        ]
    };
  });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">
            Pilih <span className="text-primary">Paket Sempurna</span> Anda
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
            Paket makanan bertenaga AI kami beradaptasi dengan gaya hidup, preferensi, dan tujuan kesehatan Anda untuk hasil yang optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {displayPlans.map((plan) => (
            <div key={plan.id} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-amber-500 text-white px-6 py-2 font-bold shadow-lg">
                    <Award className="h-4 w-4 mr-2" />
                    PALING POPULER
                  </Badge>
                </div>
              )}

              <Card className="h-full bg-card hover:shadow-xl transition-shadow duration-200 border rounded-2xl overflow-hidden">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="text-center mb-8 flex-grow">
                    <h3 className="text-2xl font-black text-foreground mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-black text-foreground">Rp{plan.price.toLocaleString('id-ID')}</span>
                      <span className="text-muted-foreground ml-2 font-bold">/meal</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium min-h-[3rem]">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {plan.perks.map((perk, perkIndex) => (
                      <div key={perkIndex} className="flex items-start">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-foreground font-medium">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className={`w-full py-4 rounded-lg font-bold text-lg`}>
                    <Link href="/subscription">
                      Pilih {plan.name}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};