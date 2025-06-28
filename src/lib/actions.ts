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
  const userId = parseInt(session.user.id); // ubah id dari string ke number jika perlu

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

// --- Action untuk mengambil langganan milik user tertentu ---
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
    // Sertakan data dari MealPlan agar kita bisa menampilkan nama plan-nya
    include: {
      mealPlan: true, 
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  // Serialisasi data agar aman dikirim ke client component jika perlu
  return subscriptions.map(sub => ({
    ...sub,
    createdAt: sub.createdAt.toISOString(),
    updatedAt: sub.updatedAt.toISOString(),
  }));
}