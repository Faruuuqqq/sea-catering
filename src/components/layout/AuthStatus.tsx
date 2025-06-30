"use client";

import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const AuthStatus = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Skeleton className="h-10 w-40" />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm font-medium text-foreground">
          Halo, {session.user?.name}
        </span>
        <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline" size="sm">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/register">Register</Link>
      </Button>
    </div>
  );
};