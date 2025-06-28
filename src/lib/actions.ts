"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/app/api/auth/[...nextauth]/route"

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

export async function getTestimonials() {
  const testimonialsFromDb = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return testimonialsFromDb.map(testimonial => ({
    ...testimonial,
    createdAt: testimonial.createdAt.toISOString(),
  }));
}

export async function registerUser(data: any) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { success: false, message: "Email sudah terdaftar." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "Registrasi berhasil! Silakan login." };
  } catch (error) {
    console.error("Registrasi gagal:", error);
    return { success: false, message: "Terjadi kesalahan saat registrasi." };
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

export async function getAdminDashboardMetrics({ from, to }: { from: Date; to: Date }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Akses ditolak: Hanya admin yang dapat melihat halaman ini.");
  }

  const whereClause = {
    createdAt: { gte: from, lte: to },
  };

  const totalSubscriptions = await prisma.subscription.count();
  const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });

  const newInRange = await prisma.subscription.count({ where: whereClause });
  const mrr = await prisma.subscription.aggregate({
    _sum: { totalPrice: true },
    where: { status: 'ACTIVE' },
  });
  const canceledInRange = await prisma.subscription.count({
    where: {
      status: 'CANCELED',
      updatedAt: { gte: from, lte: to }
    }
  });

  return {
    totalSubscriptions,
    activeSubscriptions,
    newInRange,
    mrr: mrr._sum.totalPrice || 0,
    canceledInRange,
  };
}