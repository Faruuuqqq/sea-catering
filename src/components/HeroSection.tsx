import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-dark-green text-white">
      <div className="container mx-auto px-4 text-center py-20 md:py-32">
        {/* business name */}
        <h1 className="text-4xl md:text-6xl font-bold text-cream">
          SEA Catering
        </h1>
        {/* slogan */}
        <p className="mt-4 text-lg md:text-2xl text-accent font-semibold">
          Healthy Meals, Anytime, Anywhere
        </p>
        {/* Welcoming Section */}
        <p className="mt-6 max-w-2xl mx-auto text-cream/80">
          Welcome to SEA Catering! We provide delicious healthy food that can be customized to your needs, delivered directly to all major cities in Indonesia.
        </p>
         <div className="mt-8">
            <a href="/subscription" className="btn btn-secondary">Mulai Berlangganan</a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;