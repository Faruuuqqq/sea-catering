"use client"; 

import { useState } from 'react';
import Image from 'next/image';

// Data dummy for meal plans
const mealPlans = [
  {
    id: 1,
    name: 'Diet Plan',
    price: 30000,
    description: 'Low in calories and high in fiber, ideal for weight loss programs.',
    image: '/images/diet-plan.webp',
    details: 'Each portion contains approximately 350-450 calories. The menu varies daily, focusing on fresh vegetables and lean protein.'
  },
  {
    id: 2,
    name: 'Protein Plan',
    price: 40000,
    description: 'High in protein to build muscle mass and support post-workout recovery.',
    image: '/images/protein-plan.webp',
    details: 'Each portion contains 30-40g of protein. Main protein sources include chicken breast, salmon, and lean beef.'
  },
  {
    id: 3,
    name: 'Royal Plan',
    price: 60000,
    description: 'Premium menu with organic ingredients and recipes by renowned chefs.',
    image: '/images/royal-plan.webp',
    details: 'A luxurious healthy dining experience. Features high-quality imported ingredients like wagyu, healthy foie gras, and rare organic vegetables.'
  },
];

type MealPlan = typeof mealPlans[0];

export default function MenuPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const handleOpenModal = (plan: MealPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Choose Your Meal Plan</h1>
        
        {/* Grid to show meal plan cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <Image src={plan.image} alt={plan.name} layout="fill" objectFit="cover" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-green-800">{plan.name}</h2>
                <p className="text-lg font-semibold text-gray-700 mt-2">
                  Rp{plan.price.toLocaleString('id-ID')},00 / meal
                </p>
                <p className="mt-4 text-gray-600 flex-grow">{plan.description}</p>
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="mt-6 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors w-full"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to show detail */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full m-4">
            <h3 className="text-3xl font-bold mb-4">{selectedPlan.name}</h3>
            <p className="text-gray-700">{selectedPlan.details}</p>
            <button
              onClick={handleCloseModal}
              className="mt-6 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              CLose
            </button>
          </div>
        </div>
      )}
    </div>
  );
}