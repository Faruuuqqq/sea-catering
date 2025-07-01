import * as z from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().min(3, "Nama lengkap diperlukan."),
  phone: z.string().min(10, "Nomor telepon aktif diperlukan.").regex(/^\d+$/, "Format telepon tidak valid."),
  planId: z.coerce.number().min(1, "Silakan pilih salah satu paket."),
  mealTypes: z.array(z.string()).min(1, "Pilih minimal satu jenis makanan."),
  deliveryDays: z.array(z.string()).min(1, "Pilih minimal satu hari pengiriman."),
  allergies: z.string().optional(),
});
export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, "Nama lengkap diperlukan"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export type ServerActionResult = {
  success: boolean;
  message?: string;
};
