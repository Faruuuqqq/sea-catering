"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { registerUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(3, "Nama lengkap diperlukan"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung huruf besar")
    .regex(/[a-z]/, "Password harus mengandung huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung angka")
    .regex(/[^A-Za-z0-9]/, "Password harus mengandung karakter spesial"),
});
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState({ success: false, message: '' });

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setStatusMessage({ success: false, message: '' });
    startTransition(async () => {
      const result = await registerUser(data);
      setStatusMessage(result);
      if (result.success) {
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    });
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-md w-full">
        <div className="card-body space-y-6">
          <h1 className="text-3xl font-bold text-center text-dark-green">Buat Akun</h1>
          <div>
            <label className="form-label">Nama Lengkap</label>
            <input type="text" {...register('name')} className="form-input" />
            {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" {...register('email')} className="form-input" />
            {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" {...register('password')} className="form-input" />
            {errors.password && <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isPending} className="btn btn-primary w-full text-lg mt-4 disabled:bg-gray-400">
            {isPending ? 'Mendaftar...' : 'Daftar'}
          </button>
          {statusMessage.message && (
            <div className={`text-center p-3 rounded-lg ${statusMessage.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {statusMessage.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}