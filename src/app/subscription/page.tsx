"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState, useTransition } from 'react';
import { createSubscription, getMealPlans } from '@/lib/actions';
import type { MealPlan } from '@prisma/client';

const subscriptionSchema = z.object({
  name: z.string().min(3, "Nama lengkap diperlukan"),
  phone: z.string().min(10, "Nomor telepon aktif diperlukan").regex(/^\d+$/, "Hanya angka"),
  planId: z.coerce.number({invalid_type_error: "Pilih salah satu plan"}).min(1, "Pilih salah satu plan"),
  mealTypes: z.object({ breakfast: z.boolean(), lunch: z.boolean(), dinner: z.boolean() })
    .refine(data => data.breakfast || data.lunch || data.dinner, { message: "Pilih minimal satu jenis makanan" }),
  deliveryDays: z.array(z.string()).min(1, "Pilih minimal satu hari pengiriman"),
  allergies: z.string().optional(),
});
type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export default function SubscriptionPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState({ success: false, message: '' });

  useEffect(() => {
    async function fetchPlans() {
      const plans = await getMealPlans();
      setMealPlans(plans);
    }
    fetchPlans();
  }, []);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { name: '', phone: '', planId: 0, mealTypes: { breakfast: false, lunch: false, dinner: false }, deliveryDays: [], allergies: '' },
  });
  const watchedValues = watch();
  
  useEffect(() => {
    const selectedPlan = mealPlans.find(p => p.id === Number(watchedValues.planId));
    if (!selectedPlan) { setTotalPrice(0); return; }
    const numMealTypes = Object.values(watchedValues.mealTypes).filter(Boolean).length;
    const numDeliveryDays = watchedValues.deliveryDays.length;
    setTotalPrice(selectedPlan.price * numMealTypes * numDeliveryDays * 4.3);
  }, [watchedValues, mealPlans]);

  const onSubmit = (data: SubscriptionFormData) => {
    console.log("✅ Validasi form BERHASIL. Data yang akan dikirim:", data);
    setStatusMessage({ success: false, message: '' });

    startTransition(async () => {
      console.log("🚀 Memulai transisi untuk memanggil Server Action...");
      const result = await createSubscription(data);
      console.log("📬 Server Action selesai. Hasil:", result);
      
      setStatusMessage(result);

      if (result.success) {
        reset(); 
        setTotalPrice(0);
      }
    });
  };

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 text-dark-green">Formulir Langganan</h1>
        
        <form id="subscription-form" onSubmit={handleSubmit(onSubmit)} className="card max-w-3xl mx-auto">
          <div className="card-body space-y-6">
            {/* Personal Details */}
            <div>
              <label htmlFor="name" className="form-label">Nama Lengkap*</label>
              <input {...register('name')} id="name" className="form-input" />
              {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="form-label">Nomor Telepon Aktif*</label>
              <input {...register('phone')} id="phone" className="form-input" />
              {errors.phone && <p className="text-red-500 mt-1 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Plan Selection */}
            <div className="pt-4 border-t">
              <label className="form-label">Pilih Plan*</label>
              <div className="space-y-2">
                {mealPlans.map(plan => (<label key={plan.id} className="flex items-center p-3 border rounded-lg has-[:checked]:bg-cream has-[:checked]:border-dark-green cursor-pointer">
                  <input type="radio" {...register('planId')} value={plan.id} className="mr-3" />
                  <span>{plan.name} - Rp{plan.price.toLocaleString('id-ID')}/meal</span></label>))}
              </div>
              {errors.planId && <p className="text-red-500 mt-1 text-sm">{errors.planId.message}</p>}
            </div>

            {/* Meal Type */}
            <div>
                <label className="form-label">Jenis Makanan* (Pilih minimal 1)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center p-3 border rounded-lg has-[:checked]:bg-cream has-[:checked]:border-dark-green cursor-pointer">
                        <input type="checkbox" {...register('mealTypes.breakfast')} className="mr-2" /> Breakfast
                    </label>
                    <label className="flex items-center p-3 border rounded-lg has-[:checked]:bg-cream has-[:checked]:border-dark-green cursor-pointer">
                        <input type="checkbox" {...register('mealTypes.lunch')} className="mr-2" /> Lunch
                    </label>
                    <label className="flex items-center p-3 border rounded-lg has-[:checked]:bg-cream has-[:checked]:border-dark-green cursor-pointer">
                        <input type="checkbox" {...register('mealTypes.dinner')} className="mr-2" /> Dinner
                    </label>
                </div>
                {errors.mealTypes && <p className="text-red-500 mt-1 text-sm">Pilih minimal satu jenis makanan</p>}
            </div>

            {/* Delivery Days */}
            <div>
                <label className="form-label">Hari Pengiriman* (Pilih minimal 1)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center p-3 border rounded-lg has-[:checked]:bg-cream has-[:checked]:border-dark-green cursor-pointer">
                        <input type="checkbox" {...register('deliveryDays')} value={day} className="mr-2" /> {day}
                    </label>
                    ))}
                </div>
                {errors.deliveryDays && <p className="text-red-500 mt-1 text-sm">{errors.deliveryDays.message}</p>}
            </div>

            {/* Allergies */}
            <div>
                <label htmlFor="allergies" className="form-label">Alergi (Opsional)</label>
                <textarea {...register('allergies')} id="allergies" rows={3} className="form-input"></textarea>
            </div>

            {/* Total Price & Submit */}
            <div className="bg-dark-green/5 p-6 rounded-lg text-center">
              <p className="text-lg text-dark-green">Estimasi Biaya Bulanan:</p>
              <p className="text-4xl font-bold text-dark-green my-2">Rp{totalPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <button type="submit" disabled={isPending} className="btn btn-primary w-full text-xl mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isPending ? 'Mengirim...' : 'Berlangganan Sekarang'}
              </button>
            </div>
            
            {/* Status Message Display */}
            {statusMessage.message && (
              <div className={`text-center p-3 rounded-lg ${statusMessage.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {statusMessage.message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}