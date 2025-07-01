"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { subscriptionSchema, type SubscriptionFormData } from "@/lib/validators";

const prisma = new PrismaClient();

export async function getMealPlans() {
  return await prisma.mealPlan.findMany();
}

export async function createSubscription(data: SubscriptionFormData) {
  const validationResult = subscriptionSchema.safeParse(data);

  if (!validationResult.success) {
    console.error("Validasi server gagal:", validationResult.error.flatten().fieldErrors);
    return { 
      success: false, 
      message: "Data yang dikirim tidak valid. Silakan periksa kembali isian Anda." 
    };
  }

  const validatedData = validationResult.data;

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Anda harus login untuk berlangganan." };
  }
  const userId = parseInt(session.user.id);

  try {
    const plan = await prisma.mealPlan.findUnique({ where: { id: validatedData.planId } });
    if (!plan) {
      return { success: false, message: 'Meal Plan yang dipilih tidak valid.' };
    }

    const numMealTypes = validatedData.mealTypes.length;
    const numDeliveryDays = validatedData.deliveryDays.length;
    const serverTotalPrice = plan.price * numMealTypes * numDeliveryDays * 4.3;

    await prisma.subscription.create({
      data: {
        customerName: validatedData.name,
        customerPhone: validatedData.phone,
        mealPlanId: validatedData.planId,
        mealTypes: validatedData.mealTypes,
        deliveryDays: validatedData.deliveryDays,
        allergies: validatedData.allergies,
        totalPrice: serverTotalPrice,
        userId: userId,
      },
    });

    revalidatePath('/subscription');
    revalidatePath('/dashboard');
    return { success: true, message: 'Berhasil berlangganan! Terima kasih.' };
  } catch (error) {
    console.error("Gagal membuat subscription:", error); 
    return { success: false, message: 'Terjadi kesalahan di server, silakan coba lagi.' };
  }
}

export async function getUserSubscriptions() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  const userId = parseInt(session.user.id);

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: userId,
    },
    include: {
      mealPlan: true, 
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return subscriptions.map(sub => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  }));
}

export async function getAllSubscriptions() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Akses ditolak.");
  }

  const subscriptions = await prisma.subscription.findMany({
    include: {
      mealPlan: true, 
      user: true,     
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return subscriptions.map(sub => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
    user: {
      ...sub.user,
      password: '', 
    }
  }));
}

export async function pauseSubscription(subscriptionId: number, pauseStartDate: Date, pauseEndDate: Date) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Akses ditolak." };
  }
  const userId = parseInt(session.user.id);

  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId: userId },
  });

  if (!subscription) {
    return { success: false, message: "Anda tidak berhak mengubah langganan ini." };
  }

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { 
      status: 'PAUSED',
      pauseStartDate: pauseStartDate,
      pauseEndDate: pauseEndDate,
    },
  });

  revalidatePath('/dashboard');
  return { success: true, message: "Langganan berhasil dijeda." };
}

export async function cancelSubscription(subscriptionId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Akses ditolak." };
  }
  const userId = parseInt(session.user.id);

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (subscription?.userId !== userId) {
    return { success: false, message: "Anda tidak berhak mengubah langganan ini." };
  }

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: 'CANCELED' },
  });

  revalidatePath('/dashboard');
  return { success: true, message: "Langganan berhasil dibatalkan." };
}

export async function reactivateSubscription(subscriptionId: number) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Akses ditolak." };
  }
  const userId = parseInt(session.user.id);

  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId: userId },
  });

  if (!subscription) {
    return { success: false, message: "Anda tidak berhak mengubah langganan ini." };
  }

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { 
      status: 'ACTIVE',
      pauseStartDate: null,
      pauseEndDate: null,
    },
  });

  revalidatePath('/dashboard');
  return { success: true, message: "Langganan berhasil diaktifkan kembali." };
}