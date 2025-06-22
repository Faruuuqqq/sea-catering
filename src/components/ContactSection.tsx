import React from 'react';

const ContactSection = () => {
  return (
    <section className="bg-green-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-700">Have a question? Get in touch with our manager:</p>
        <div className="mt-4 bg-white inline-block p-6 rounded-lg shadow-md">
          <p className="text-xl font-bold">Brian</p>
          <p className="text-lg text-gray-600">08123456789</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;