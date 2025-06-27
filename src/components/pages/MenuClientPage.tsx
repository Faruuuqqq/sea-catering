"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { MealPlan } from '@prisma/client';

type Props = {
  mealPlans: MealPlan[];
};

const MenuClientPage: React.FC<Props> = ({ mealPlans }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const handleOpenModal = (plan: MealPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleTransitionEnd = () => {
    if (!isModalOpen) {
      setSelectedPlan(null);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-dark-green">Pilih Meal Plan Kamu</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="card flex flex-col">
              <div className="relative h-48 w-full">
                <Image src={plan.image} alt={plan.name} layout="fill" objectFit="cover" />
              </div>
              <div className="card-body">
                <h2 className="text-2xl font-bold text-dark-green">{plan.name}</h2>
                <p className="text-xl font-semibold text-mid-green mt-2">
                  Rp{plan.price.toLocaleString('id-ID')},00/meal
                </p>
                <p className="mt-4 text-text-main/80 flex-grow">{plan.description}</p>
                <button onClick={() => handleOpenModal(plan)} className="btn btn-primary mt-6 w-full">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`fixed inset-0 bg-black flex justify-center items-center z-50 p-4 transition-opacity duration-300
            ${isModalOpen ? 'bg-opacity-60 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'}`
          }
        >
          <div className={`card max-w-lg w-full transform transition-transform duration-300
            ${isModalOpen ? 'scale-100' : 'scale-95'}`
          }>
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-4 text-dark-green">{selectedPlan.name}</h3>
              <p className="text-text-main">{selectedPlan.details}</p>
              <button onClick={handleCloseModal} className="btn btn-secondary mt-6">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuClientPage;