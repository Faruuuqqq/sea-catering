import React from 'react';

const ContactSection = () => {
  return (
    <section className="bg-dark-green py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
        
        <p className="text-white">
          Have a question? Get in touch with our manager:
        </p>
        
        <div className="mt-6 bg-cream inline-block p-8 rounded-lg shadow-lg">
          <p className="text-2xl text-dark-green font-bold">
            Brian
          </p>
          <p className="text-lg text-mid-green mt-1">
            08123456789
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;