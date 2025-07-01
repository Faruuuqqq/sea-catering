"use client";

import React, { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { createTestimonial } from '@/lib/actions/testimonial.actions';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star, Send } from 'lucide-react';

type ServerActionResult = {
  success: boolean;
  message: string;
};

const AuthenticatedForm = ({ session }: { session: Session }) => {
    const [rating, setRating] = useState(5);
    const [isPending, startTransition] = useTransition();
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        formData.append('rating', rating.toString());

        startTransition(async () => {
            const result: ServerActionResult = await createTestimonial(formData);
            
            if (result.success) {
                toast.success("Review Terkirim!", { description: result.message });
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
                        <input type="hidden" name="rating" value={rating} />
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
        <Card className="text-center"><CardContent className="p-8">
            <h3 className="text-xl font-bold mb-2">Ingin Memberi Review?</h3>
            <p className="text-muted-foreground mb-4">Silakan login terlebih dahulu.</p>
            <Button asChild><Link href="/login">Login</Link></Button>
        </CardContent></Card>
    )
}
const LoadingSkeleton = () => <Card className="h-96 w-full max-w-2xl mx-auto bg-muted animate-pulse" />

export function TestimonialForm() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingSkeleton />;
  }

  if (status === "authenticated") {
    return <AuthenticatedForm session={session} />;
  }

  return <LoginPrompt />;
};
