"use client";

import React, { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { createTestimonial } from '@/lib/actions/testimonial.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner';

const AuthenticatedForm = ({ session }: { session: any }) => {
    const [rating, setRating] = useState(5);
    const [isPending, startTransition] = useTransition();
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        formData.append('rating', rating.toString());
        startTransition(async () => {
            const result = await createTestimonial(formData);
            if (result.success) {
                toast.success("Review Terkirim!", { description: "Terima kasih atas masukan Anda." });
                formRef.current?.reset();
                setRating(5);
            } else {
                toast.error("Oops! Terjadi Kesalahan", { description: result.message });
            }
        });
    };

    return (
        <Card className="shadow-lg">
            <CardHeader className="text-center">
                <CardTitle>Bagikan Pengalaman Anda</CardTitle>
                <CardDescription>Bantu pelanggan lain membuat keputusan yang lebih baik.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Nama</Label>
                        <Input id="name" name="name" readOnly defaultValue={session.user?.name || ''} className="bg-secondary cursor-not-allowed" />
                    </div>
                    <div>
                        <Label htmlFor="review">Review Anda</Label>
                        <Textarea id="review" name="review" placeholder="Ceritakan pengalaman Anda..." required />
                    </div>
                    <div>
                        <Label>Rating Anda</Label>
                        <div className="flex items-center gap-2 mt-2">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <button type="button" key={ratingValue} onClick={() => setRating(ratingValue)}>
                                        <Star className={`w-7 h-7 cursor-pointer transition-all duration-200 ${ratingValue <= rating ? 'text-accent fill-accent' : 'text-muted-foreground/30 hover:text-accent'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        <Send className="w-4 h-4 mr-2" />
                        {isPending ? 'Mengirim...' : 'Kirim Review'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

const LoginPrompt = () => {
  return (
    <div className="card max-w-2xl mx-auto">
      <div className="card-body text-center">
        <h3 className="text-2xl font-bold text-dark-green mb-4">Ingin Memberi Review?</h3>
        <p className="text-text-main mb-6">Silakan login terlebih dahulu untuk membagikan pengalamanmu bersama kami.</p>
        <Link href="/login" className="btn btn-primary">
          Login untuk Memberi Review
        </Link>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return <div className="card max-w-2xl mx-auto h-96 bg-gray-200 animate-pulse"></div>;
};

export const TestimonialForm = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSkeleton />;
  }

  if (status === "authenticated") {
    return <AuthenticatedForm session={session} />;
  }
  
  return <LoginPrompt />;
};