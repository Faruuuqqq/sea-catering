import React from 'react';
import Link from 'next/link';

type NavLink = {
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Meal Plans', href: '/menu' },
  { name: 'Subscription', href: '/subscription' },
  { name: 'Contact Us', href: '/contact' },
];

const Footer = () => {
  return (
    <footer className="bg-dark-green text-cream">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          {/* Branding */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white">SEA Catering</h3>
            <p className="mt-2 text-cream/80 max-w-sm">
              Healthy Meals, Anytime, Anywhere
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg text-white tracking-wider">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/80 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg text-white tracking-wider">Follow Us</h4>
            <div className="flex space-x-4 mt-4">
              <a href="#" aria-label="Instagram" className="text-cream/80 hover:text-accent transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {/* Instagram Icon Path */}
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.585-.011-4.85-.069c-3.225-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.117 0-3.486.01-4.711.065-2.698.123-3.974 1.4-4.098 4.098-.056 1.225-.066 1.593-.066 4.711s.01 3.486.066 4.711c.123 2.698 1.4 3.974 4.098 4.098 1.225.056 1.593.066 4.711.066s3.486-.01 4.711-.066c2.698-.123 3.974-1.4 4.098-4.098.056-1.225.066-1.593.066-4.711s-.01-3.486-.066-4.711c-.123-2.698-1.4-3.974-4.098-4.098-1.225-.056-1.593-.066-4.711-.066zm0 2.993c-1.996 0-3.612 1.616-3.612 3.612s1.616 3.612 3.612 3.612 3.612-1.616 3.612-3.612-1.616-3.612-3.612-3.612zm0 5.781c-1.196 0-2.169-.973-2.169-2.169s.973-2.169 2.169-2.169 2.169.973 2.169 2.169-.973 2.169-2.169 2.169zm4.336-5.781c-.663 0-1.2.537-1.2 1.2s.537 1.2 1.2 1.2 1.2-.537 1.2-1.2-.537-1.2-1.2-1.2z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-cream/80 hover:text-accent transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {/* Facebook Icon Path */}
                  <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-mid-green/50 text-center text-cream/60 text-sm">
          <p>&copy; {new Date().getFullYear()} SEA Catering. Dibuat dengan ❤ untuk Compfest.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;