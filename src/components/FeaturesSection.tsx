import React from 'react';

const features = [
  {
    title: 'Menu Customization',
    description: 'Choose your preferred protein, carbohydrates, and vegetables.',
  },
  {
    title: 'Delivery to Major Cities',
    description: 'We serve Jakarta, Surabaya, Bandung, and other cities.',
  },
  {
    title: 'Detailed Nutrition Information',
    description: 'Find out the calories and macronutrients in each meal portion.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Our Main Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-800">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;