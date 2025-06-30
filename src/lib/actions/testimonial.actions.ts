"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

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