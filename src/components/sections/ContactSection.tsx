import React from 'react';

export const ContactSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-dark-green mb-4">Contact Us</h2>
        
        <p className="text-dark-green">
          Have a question? Get in touch with our manager:
        </p>
        
        <div className="mt-6 bg-dark-green inline-block p-8 rounded-lg shadow-lg">
          <p className="text-2xl text-white font-bold">
            Brian
          </p>
          <p className="text-lg text-white mt-1">
            08123456789
          </p>
        </div>
      </div>
    </section>
  );
};