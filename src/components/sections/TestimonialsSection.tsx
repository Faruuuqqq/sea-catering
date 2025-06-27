// Ini adalah Server Component, tugasnya mengambil data
import { getTestimonials } from '@/lib/actions';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { TestimonialForm } from './TestimonialForm';

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section className="bg-cream py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-dark-green mb-10">
          Apa Kata Mereka?
        </h2>
        
        <div className="mb-16">
          {testimonials.length > 0 ? (
            <TestimonialCarousel testimonials={testimonials} />
          ) : (
            <p className="text-center text-text-main/70">Belum ada testimoni. Jadilah yang pertama!</p>
          )}
        </div>

        <TestimonialForm />
      </div>
    </section>
  );
}