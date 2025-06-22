import React from 'react';

const HeroSection = () => {
  return (
  // 'w-full' = full width, 'py-20' = top-bottom padding
    <section className="w-full bg-green-50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* business name */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          SEA Catering
        </h1>
        {/* slogan */}
        <p className="mt-4 text-lg md:text-2xl text-green-700 font-semibold">
          Healthy Meals, Anytime, Anywhere
        </p>
        {/* Welcoming Section */}
        <p className="mt-6 max-w-2xl mx-auto text-gray-600">
          Welcome to SEA Catering! We provide delicious healthy food that can be customized to your needs, delivered directly to all major cities in Indonesia.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;