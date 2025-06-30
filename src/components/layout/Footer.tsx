import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Utensils, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const companyLinks = [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Karir', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ];
  const supportLinks = [
    { name: 'Pusat Bantuan', href: '/help' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Hubungi Kami', href: '/contact' },
  ];
  const legalLinks = [
    { name: 'Kebijakan Privasi', href: '/privacy' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Kolom 1: Branding & Deskripsi */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SEA Catering</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Merevolusi makanan sehat di Indonesia dengan personalisasi bertenaga AI, rasa yang luar biasa, dan pengiriman yang andal.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Kolom 2, 3, 4: Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-2">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Perusahaan</h4>
              <ul className="space-y-3">
                {companyLinks.map(link => <li key={link.name}><Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.name}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Dukungan</h4>
              <ul className="space-y-3">
                {supportLinks.map(link => <li key={link.name}><Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.name}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map(link => <li key={link.name}><Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.name}</Link></li>)}
              </ul>
            </div>
          </div>
          
          {/* Kolom 5: Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Berlangganan Newsletter Kami</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Dapatkan tips sehat, resep baru, dan promo spesial langsung di email Anda.
            </p>
            <form className="flex gap-2">
              <Input type="email" placeholder="Email Anda" className="bg-background" />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>

        </div>

        {/* Bagian Copyright Bawah */}
        <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SEA Catering. Dibuat dengan ❤ untuk Compfest.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;