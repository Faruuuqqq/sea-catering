"use client";

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';

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

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (

            <div className="flex-grow-0 flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4" key={index}>
              
              <div className="card bg-white p-6 h-full flex flex-col">
                <p className="text-text-main/90 italic flex-grow">
                  {testimonial.review}
                </p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <p className="font-bold text-dark-green">- {testimonial.name}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      {/* Navigasi Slider Button */}
      <button className="absolute top-1/2 -translate-y-1/2 left-0 btn btn-primary !p-3 !rounded-full opacity-70 hover:opacity-100" onClick={scrollPrev}>&#8592;</button>
      <button className="absolute top-1/2 -translate-y-1/2 right-0 btn btn-primary !p-3 !rounded-full opacity-70 hover:opacity-100" onClick={scrollNext}>&#8594;</button>
    </div>
  );
};