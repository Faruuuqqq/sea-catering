"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getMealPlans() {
  return await prisma.mealPlan.findMany();
}

export async function createTestimonial(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const review = formData.get("review") as string;
    const rating = Number(formData.get("rating"));

    await prisma.testimonial.create({
      data: { name, review, rating },
    });

    revalidatePath('/');
    return { success: true, message: 'Testimoni berhasil dikirim!' };
  } catch (error) {
    return { error, success: false, message: 'Gagal mengirim testimoni'}
  }
}

export async function createSubscription(data: any) {
  console.log("Data diterima oleh server:", data);
  try {
    const plan = await prisma.mealPlan.findUnique({ where: { id: data.planId } });
    if (!plan) throw new Error('Plan tidak ditemukan');

    const numMealTypes = Object.values(data.mealTypes).filter(Boolean).length;
    const numDeliveryDays = data.deliveryDays.length;
    const serverTotalPrice = plan.price * numMealTypes * numDeliveryDays * 4.3;

    const mealTypesArray = Object.keys(data.mealTypes).filter(key => data.mealTypes[key]);

    await prisma.subscription.create({
      data: {
        customerName: data.name,
        customerPhone: data.phone,
        mealPlanId: data.planId,
        mealTypes: mealTypesArray,
        deliveryDays: data.deliveryDays,
        allergies: data.allergies,
        totalPrice: serverTotalPrice,
      },
    });

    revalidatePath('/subscription');
    return { success: true, message: 'Berhasil berlangganan!' };
  } catch (error) {
    return { error, success: false, message: 'Gagal melakukan langganan.' };
  }
}

export async function getTestimonials() {
  return await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}