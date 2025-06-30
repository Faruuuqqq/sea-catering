"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Testimonial = {
  id: number;
  name: string;
  review: string;
  rating: number;
  createdAt: string; 
};

type Props = {
  testimonials: Testimonial[];
};

export const TestimonialCarousel: React.FC<Props> = ({ testimonials }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex -ml-4">
        {testimonials.map((testimonial) => (
          <div className="flex-grow-0 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4" key={testimonial.id}>
            <Card className="h-full flex flex-col justify-between bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <blockquote className="text-foreground text-lg leading-relaxed font-medium italic mb-6">
                  "{testimonial.review}"
                </blockquote>
              </CardContent>
              <div className="bg-secondary/50 p-6 flex items-center gap-4 border-t">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${testimonial.name}`} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};