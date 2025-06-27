import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'] 
});

export const metadata: Metadata = {
  title: 'SEA Catering',
  description: 'Healthy Meals, Anytime, Anywhere',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}