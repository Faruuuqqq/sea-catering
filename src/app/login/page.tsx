"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Email atau password salah. Silakan coba lagi.");
    } else {
      router.push('/subscription');
    }
  };

  return (
    <div className="bg-cream min-h-screen flex items-center justify-center py-12">
      <form onSubmit={handleSubmit} className="card max-w-md w-full">
        <div className="card-body space-y-6">
          <h1 className="text-3xl font-bold text-center text-dark-green">Login</h1>
          <div>
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" required />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required />
          </div>
          <button type="submit" className="btn btn-primary w-full text-lg mt-4">
            Login
          </button>
          {error && (
            <div className="text-center p-3 rounded-lg bg-red-100 text-red-800">
              {error}
            </div>
          )}
           <p className="text-center text-sm text-text-main/80">
            Belum punya akun? <a href="/register" className="text-dark-green font-semibold hover:underline">Daftar di sini</a>
          </p>
        </div>
      </form>
    </div>
  );
}