"use client";

import { useForm, Controller } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { createSubscription, getMealPlans } from '@/lib/actions/subscription.actions';
import type { MealPlan } from '@prisma/client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, AlertCircle } from "lucide-react";

const subscriptionSchema = z.object({
  name: z.string().min(3, "Nama lengkap diperlukan"),
  phone: z.string().min(10, "Nomor telepon aktif diperlukan").regex(/^\d+$/, "Hanya angka"),
  planId: z.coerce.number().min(1, "Pilih salah satu plan"),
  mealTypes: z.array(z.string()).min(1, "Pilih minimal satu jenis makanan"),
  deliveryDays: z.array(z.string()).min(1, "Pilih minimal satu hari pengiriman"),
  allergies: z.string().optional(),
});
type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export function SubscriptionForm() {
  const { data: session } = useSession();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPending, startTransition] = useTransition();

  const { control, register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { name: '', phone: '', planId: 0, mealTypes: [], deliveryDays: [], allergies: '' },
  });
  const watchedValues = watch();

  useEffect(() => {
    getMealPlans().then(setMealPlans);
  }, []);
  
  useEffect(() => {
    if (session?.user?.name) {
      setValue('name', session.user.name);
    }
  }, [session, setValue]);

  useEffect(() => {
    const selectedPlan = mealPlans.find(p => p.id === Number(watchedValues.planId));
    if (!selectedPlan || !watchedValues.mealTypes || !watchedValues.deliveryDays) {
      setTotalPrice(0);
      return;
    }
    const numMealTypes = watchedValues.mealTypes.length;
    const numDeliveryDays = watchedValues.deliveryDays.length;
    setTotalPrice(selectedPlan.price * numMealTypes * numDeliveryDays * 4.3);
  }, [watchedValues, mealPlans]);

  const onSubmit = (data: SubscriptionFormData) => {
    startTransition(async () => {
      const result = await createSubscription(data);
      if (result.success) {
        toast.success("Langganan Berhasil!", { description: "Terima kasih telah bergabung dengan kami." });
        reset(); 
        setTotalPrice(0);
      } else {
        toast.error("Gagal Berlangganan", { description: result.message });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <form id="subscription-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Kolom Kiri: Form Input */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Informasi Pribadi</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap*</Label>
                  <Input {...register('name')} id="name" className="bg-secondary cursor-not-allowed" readOnly />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon Aktif*</Label>
                  <Input {...register('phone')} id="phone" placeholder="0812..." />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Pilihan Paket*</CardTitle></CardHeader>
              <CardContent>
                <Controller
                  name="planId"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} defaultValue={String(field.value)} className="space-y-3">
                      {mealPlans.map(plan => (
                        <Label key={plan.id} htmlFor={String(plan.id)} className="flex items-center p-4 border rounded-lg has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer">
                          <RadioGroupItem value={String(plan.id)} id={String(plan.id)} />
                          <span className="ml-4 flex-1">{plan.name}</span>
                          <span className="font-semibold">Rp{plan.price.toLocaleString('id-ID')}/meal</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.planId && <p className="text-sm text-destructive mt-2">{errors.planId.message}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Kustomisasi Pesanan*</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-semibold">Jenis Makanan (pilih min. 1)</Label>
                  <Controller
                    name="mealTypes"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {['Breakfast', 'Lunch', 'Dinner'].map(type => (
                          <Label key={type} className="flex items-center gap-2 p-3 border rounded-lg has-[:has(:checked)]:border-primary has-[:has(:checked)]:bg-primary/10 cursor-pointer">
                            <Checkbox
                              checked={field.value?.includes(type)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type])
                                  : field.onChange(field.value?.filter(v => v !== type))
                              }}
                            /> {type}
                          </Label>
                        ))}
                      </div>
                    )}
                  />
                  {errors.mealTypes && <p className="text-sm text-destructive mt-2">{errors.mealTypes.message}</p>}
                </div>
                <div>
                  <Label className="font-semibold">Hari Pengiriman (pilih min. 1)</Label>
                  <Controller
                    name="deliveryDays"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <Label key={day} className="flex items-center gap-2 p-3 border rounded-lg has-[:has(:checked)]:border-primary has-[:has(:checked)]:bg-primary/10 cursor-pointer">
                            <Checkbox
                              checked={field.value?.includes(day)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day])
                                  : field.onChange(field.value?.filter(v => v !== day))
                              }}
                            /> {day}
                          </Label>
                        ))}
                      </div>
                    )}
                  />
                  {errors.deliveryDays && <p className="text-sm text-destructive mt-2">{errors.deliveryDays.message}</p>}
                </div>
                <div>
                    <Label htmlFor="allergies">Alergi & Preferensi (Opsional)</Label>
                    <Textarea {...register('allergies')} id="allergies" placeholder="Contoh: tidak suka pedas, alergi kacang..." />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Kalkulator & Submit */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center"><Calculator className="mr-2 h-5 w-5" /> Kalkulator Harga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {totalPrice > 0 ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      {mealPlans.find(p => p.id === Number(watchedValues.planId))?.price.toLocaleString('id-ID')} × {watchedValues.mealTypes?.length} meals × {watchedValues.deliveryDays?.length} days × 4.3 weeks
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                      <span className="font-semibold">Total Bulanan:</span>
                      <span className="text-2xl font-bold text-primary">Rp{totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-4">Pilih paket Anda untuk melihat harga.</div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full" disabled={isPending}>
                  {isPending ? 'Memproses...' : 'Berlangganan Sekarang'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
