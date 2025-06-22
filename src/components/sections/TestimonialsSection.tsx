"use client";

import { useState } from 'react';

// Dummy testimonial data
const sampleTestimonials = [
  { name: 'Andi', review: 'The food is delicious and healthy, always delivered on time!', rating: 5 },
  { name: 'Siti', review: 'Dieting is much easier with SEA Catering. Lost 5 kg in a month!', rating: 3 },
  { name: 'Budi', review: 'Absolutely love the Protein Plan, really helps after working out.', rating: 4 },
];

export default function TestimonialsSection() {
  // Form state
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Untuk sekarang, kita hanya tampilkan di console
    // Nanti di Level 3, data ini akan dikirim ke database
    console.log({ name, review, rating });
    alert('Terima kasih atas review Anda!');
    // Reset form
    setName('');
    setReview('');
    setRating(0);
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          What Our Customers Say
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {sampleTestimonials.map((testimonial, index) => (
            <div key={index} className="bg-green-50 p-6 rounded-lg shadow-md">
              <p className="text-gray-600">"{testimonial.review}"</p>
              <div className="flex justify-between items-center mt-4">
                <p className="font-bold text-green-800">- {testimonial.name}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Submission Form */}
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl text-gray-700 font-bold text-center mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="review" className="block text-gray-700 font-semibold mb-2">Review</label>
                    <textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-lg" required></textarea>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                    <div className="flex space-x-1">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button type="button" key={ratingValue} onClick={() => setRating(ratingValue)}>
                                    <svg className={`w-8 h-8 cursor-pointer ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"> Submit Review</button>
            </form>
        </div>
      </div>
    </section>
  );
}