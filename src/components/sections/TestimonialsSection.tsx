import { getTestimonials } from '@/lib/actions/testimonial.actions';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { TestimonialForm } from '../forms/TestimonialForm';
import { Card, CardContent } from '@/components/ui/card';

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return (
    <section className="bg-secondary py-24 sm:py-32">
      <div className="container mx-auto px-4">
        {/* Gunakan layout grid untuk memisahkan carousel dan form */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Kolom Kiri: Judul dan Carousel */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Apa Kata Mereka?</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Dengarkan langsung dari para pelanggan yang telah merasakan manfaatnya.
              </p>
            </div>
            {testimonials.length > 0 ? (
              <TestimonialCarousel testimonials={testimonials} />
            ) : (
              <Card><CardContent className="p-8 text-center text-muted-foreground">Belum ada testimoni. Jadilah yang pertama!</CardContent></Card>
            )}
          </div>

          {/* Kolom Kanan: Form Submit */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <TestimonialForm />
          </div>

        </div>
      </div>
    </section>
  );
}