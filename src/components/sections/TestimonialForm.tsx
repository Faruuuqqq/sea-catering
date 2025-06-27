"use client";

import { useState, useTransition } from 'react';
import { createTestimonial } from '@/lib/actions';

export const TestimonialForm = () => {
  const [rating, setRating] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    formData.append('rating', rating.toString());

    startTransition(async () => {
      const result = await createTestimonial(formData);
      if (result.success) {
        alert(result.message);
        (document.getElementById('testimonial-form') as HTMLFormElement)?.reset();
        setRating(0);
      } else {
        alert(result.message || 'Terjadi kesalahan.');
      }
    });
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="card-body">
        <h3 className="text-2xl font-bold text-center mb-6 text-dark-green">Bagikan Pengalamanmu</h3>
        <form id="testimonial-form" action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="form-label">Nama</label>
            <input type="text" id="name" name="name" className="form-input" required />
          </div>
          <div>
            <label htmlFor="review" className="form-label">Review</label>
            <textarea id="review" name="review" rows={4} className="form-input" required></textarea>
          </div>
          <div className="mb-2">
            <label className="form-label">Rating</label>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button type="button" key={ratingValue} onClick={() => setRating(ratingValue)}>
                    <svg className={`w-8 h-8 cursor-pointer transition-colors ${ratingValue <= rating ? 'text-accent' : 'text-gray-300 hover:text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </button>
                );
              })}
            </div>
          </div>
          <button type="submit" disabled={isPending} className="btn btn-primary w-full !mt-6 disabled:bg-gray-400">
            {isPending ? 'Mengirim...' : 'Kirim Review'}
          </button>
        </form>
      </div>
    </div>
  );
};