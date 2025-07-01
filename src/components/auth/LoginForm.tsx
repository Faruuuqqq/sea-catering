"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Shield, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const Branding = () => (
    <div className="hidden lg:block space-y-8">
        <div>
            <h2 className="text-4xl font-bold text-foreground mb-4">Selamat Datang Kembali di <span className="text-primary">Perjalanan Sehatmu</span></h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
                Lanjutkan transformasimu dengan makanan yang dipersonalisasi, dibuat oleh koki top dan dioptimalkan oleh AI.
            </p>
        </div>
        <div className="space-y-6">
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0"><Users className="h-6 w-6 text-primary" /></div>
                <div>
                    <h3 className="font-bold text-foreground mb-1">10,000+ Pelanggan Bahagia</h3>
                    <p className="text-muted-foreground">Bergabunglah dengan komunitas pecinta makanan sehat kami yang terus berkembang.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0"><Shield className="h-6 w-6 text-accent" /></div>
                <div>
                    <h3 className="font-bold text-foreground mb-1">Aman & Terpercaya</h3>
                    <p className="text-muted-foreground">Data Anda dilindungi dengan keamanan tingkat perusahaan.</p>
                </div>
            </div>
        </div>
    </div>
);


export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error("Login Gagal", { description: "Email atau password yang Anda masukkan salah." });
    } else {
      toast.success("Login Berhasil!", { description: "Selamat datang kembali." });
      router.push('/dashboard');
      router.refresh(); 
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Branding />
        <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-xl rounded-2xl">
          <CardHeader className="text-center p-8">
            <CardTitle className="text-2xl font-bold">Login ke Akun Anda</CardTitle>
            <CardDescription>Silakan masukkan detail Anda.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="kamu@email.com" className="pl-10" required />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" name="password" type="password" className="pl-10" required />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded border-border text-primary focus:ring-primary" /> Ingat saya</label>
                <Link href="#" className="font-semibold text-primary hover:underline">Lupa password?</Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Login'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Daftar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}