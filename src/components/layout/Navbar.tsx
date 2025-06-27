"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AuthStatus } from './AuthStatus';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Meal Plans', href: '/menu' },
  { name: 'Subscription', href: '/subscription' },
  { name: 'Contact Us', href: '/contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo / Brand Name */}
          <Link href="/" className="text-2xl font-bold text-green-700">
            SEA Catering
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    ${isActive ? 'text-green-600 font-bold' : 'text-gray-600'}
                    hover:text-green-600 transition-colors
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pl-4">
              <AuthStatus />
            </div>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {/* Icon (simple hamburger) */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-600 hover:text-green-600"
            >
              {link.name}
            </Link>
          ))}
            <div className="pl-4">
              <AuthStatus />
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;