"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { registerUser } from '@/lib/actions/auth.actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, Gift, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(3, "Nama lengkap diperlukan."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});
type RegisterFormData = z.infer<typeof registerSchema>;

const Benefits = () => (
    <div className="hidden lg:block space-y-8">
        <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Mulai <span className="text-primary">Transformasi Anda</span> Hari Ini</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Bergabunglah dengan komunitas kami dan temukan betapa lezatnya makan sehat.
            </p>
        </div>
        <div className="space-y-6">
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Gift className="h-6 w-6 text-primary" /></div>
                <div>
                    <h3 className="font-bold text-foreground mb-1">Penawaran Spesial</h3>
                    <p className="text-muted-foreground">Dapatkan diskon 50% di bulan pertama Anda saat mendaftar hari ini!</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><Star className="h-6 w-6 text-accent" /></div>
                <div>
                    <h3 className="font-bold text-foreground mb-1">Rating 4.9/5</h3>
                    <p className="text-muted-foreground">Dipercaya oleh ribuan pecinta makanan sehat.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><TrendingUp className="h-6 w-6 text-green-600" /></div>
                <div>
                    <h3 className="font-bold text-foreground mb-1">Hasil Terbukti</h3>
                    <p className="text-muted-foreground">95% pelanggan melaporkan peningkatan energi dalam 30 hari.</p>
                </div>
            </div>
        </div>
    </div>
);

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      const result = await registerUser(data);
      if (result.success) {
        toast.success("Registrasi Berhasil!", { description: "Anda akan diarahkan ke halaman login." });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error("Registrasi Gagal", { description: result.message });
      }
    });
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Benefits />
        <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-2xl font-bold">Buat Akun Baru</CardTitle>
            <CardDescription>Hanya butuh beberapa detik untuk memulai.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="name" placeholder="John Doe" className="pl-10" {...register('name')} />
                </div>
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="kamu@email.com" className="pl-10" {...register('email')} />
                </div>
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input id="password" type="password" placeholder="Minimal 8 karakter" className="pl-10" {...register('password')} />
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Mendaftarkan...' : 'Buat Akun'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}