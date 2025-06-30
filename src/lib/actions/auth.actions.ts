"use server"

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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