// import { Card, CardContent } from "@/components/ui/card"
// import { Phone, Users } from "lucide-react"
// import { Navigation } from "@/components/navigation"

// export default function ContactPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation />
//       <div className="py-12">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
//             <p className="text-lg text-gray-600">Get in touch with our team for any inquiries</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center mb-4">
//                   <Users className="h-6 w-6 text-green-600 mr-3" />
//                   <h3 className="text-lg font-semibold">Manager</h3>
//                 </div>
//                 <p className="text-gray-600">Brian</p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-center mb-4">
//                   <Phone className="h-6 w-6 text-green-600 mr-3" />
//                   <h3 className="text-lg font-semibold">Phone Number</h3>
//                 </div>
//                 <p className="text-gray-600">08123456789</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import React from 'react';

// Nama komponen diubah menjadi ContactPage agar jelas
const ContactPage = () => {
  return (
    // Kita berikan sedikit padding atas dan bawah agar tidak menempel di Navbar
    <div className="py-10">
      <section className="bg-cream py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-dark-green mb-4">Hubungi Kami</h2>
          <p className="text-text-main/90">
            Punya pertanyaan? Hubungi manajer kami:
          </p>
          <div className="bg-white mt-6 inline-block p-8 rounded-lg shadow-lg">
            <p className="text-2xl text-dark-green font-bold">
              Brian
            </p>
            <p className="text-lg text-mid-green mt-1">
              08123456789
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;