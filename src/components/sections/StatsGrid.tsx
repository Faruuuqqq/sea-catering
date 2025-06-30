import { Users, Truck, Star, MapPin } from "lucide-react";

const stats = [
  { number: "10,247", label: "Happy Customers", icon: Users },
  { number: "52,891", label: "Meals Delivered", icon: Truck },
  { number: "4.9/5", label: "Average Rating", icon: Star },
  { number: "15+", label: "Cities Covered", icon: MapPin },
];

export const StatsGrid = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-10 w-10 text-dark-green mx-auto mb-3" />
              <div className="text-3xl font-black text-dark-green">{stat.number}</div>
              <p className="text-text-main/70 font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};