"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Utensils, CreditCard, Mail, LayoutDashboard, ShieldUser, Sparkles } from 'lucide-react';
import { AuthStatus } from './AuthStatus';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Menu', href: '/menu', icon: Utensils },
    { name: 'Subscription', href: '/subscription', icon: CreditCard },
    { name: 'AI Consultation', href: '/consultation', icon: Sparkles },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  if (session) {
    navItems.push({ name: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard });
  }
  if (session?.user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin', href: '/admin/dashboard', icon: ShieldUser });
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-bold text-dark-green">
              SEA<span className="text-primary">Catering</span>
            </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button key={item.name} asChild variant={pathname === item.href ? "secondary" : "ghost"}>
                <Link href={item.href}>{item.name}</Link>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <AuthStatus />
            </div>
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu /></Button>
                </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col gap-3 mt-8">
                    {navItems.map((item) => (
                      <Button key={item.name} asChild variant={pathname === item.href ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setIsOpen(false)}>
                        <Link href={item.href}><item.icon className="h-4 w-4" /> {item.name}</Link>
                      </Button>
                    ))}
                    <div className="border-t pt-4 mt-4">
                      <AuthStatus />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}