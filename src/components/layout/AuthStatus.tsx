"use client";

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

export const AuthStatus = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">Halo, {session.user?.name}</span>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-secondary !py-2 !px-4">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="font-semibold text-text-main/60 hover:text-dark-green transition-colors">
        Login
      </Link>
      <Link href="/register" className="btn btn-primary !py-1.5 !px-3">
        Register
      </Link>
    </div>
  );
};