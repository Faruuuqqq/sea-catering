import { Card, CardContent } from "@/components/ui/card";
import { Zap, Truck, Award } from "lucide-react";

const features = [
  { icon: Zap, title: "AI-Powered Meal Matching", description: "Sistem cerdas kami mempelajari preferensi dan tujuan kesehatan Anda untuk menyarankan makanan yang paling pas." },
  { icon: Truck, title: "Fast & Reliable Delivery", description: "Pengiriman di hari yang sama di lebih dari 15 kota dengan pelacakan real-time untuk kesegaran maksimal." },
  { icon: Award, title: "Chef-Crafted Excellence", description: "Setiap resep dikembangkan oleh talenta kuliner terbaik dan disetujui oleh tim nutrisi kami." },
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-black text-dark-green mb-4">Kenapa Memilih SEA Catering?</h2>
        <p className="text-lg text-text-main/80 max-w-2xl mx-auto mb-12">Kami menggabungkan teknologi mutakhir dengan keunggulan kuliner.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
          <Card key={feature.title} className="text-left text-foreground bg-white shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-dark-green/10 rounded-xl flex items-center justify-center mb-5">
                    <feature.icon className="h-7 w-7 text-dark-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-main/80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};