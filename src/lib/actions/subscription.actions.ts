"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";
import { auth } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient();

export async function getMealPlans() {
  return await prisma.mealPlan.findMany();
}

export async function createSubscription(data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Anda harus login untuk berlangganan." };
  }
  const userId = parseInt(session.user.id);

  console.log("Data diterima oleh server:", data);
  try {
    const plan = await prisma.mealPlan.findUnique({ where: { id: data.planId } });
    if (!plan) {
      return { success: false, message: 'Meal Plan yang dipilih tidak valid.' };
    }

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
        userId: userId,
      },
    });

    revalidatePath('/subscription');
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