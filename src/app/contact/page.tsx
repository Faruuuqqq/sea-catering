"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { toast } from 'sonner';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Pesan Terkirim!", {
      description: "Terima kasih telah menghubungi kami. Tim kami akan segera merespons.",
    });

    setIsSubmitting(false);
    formRef.current?.reset();
  };

  const contactMethods = [
    { icon: Phone, title: "Call Center", value: "+62 812-3456-789", action: "Call Now", color: "text-primary", bgColor: "bg-primary/10" },
    { icon: Mail, title: "Email Support", value: "hello@seacatering.id", action: "Send Email", color: "text-accent", bgColor: "bg-accent/10" },
    { icon: MessageCircle, title: "Live Chat", value: "Chat with Brian", action: "Start Chat", color: "text-green-600", bgColor: "bg-green-50/50" },
  ];

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="py-20 text-center bg-background">
        <div className="container">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan, masukan, atau butuh bantuan? Tim kami siap membantu Anda.
          </p>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${method.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{method.title}</h3>
                  <p className="text-lg text-muted-foreground font-medium mb-4">{method.value}</p>
                  <Button variant="outline">{method.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Location Section */}
      <section className="pb-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Kolom Kiri: Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Kirim Pesan Langsung</h2>
              <p className="text-muted-foreground mb-8">Isi formulir di bawah dan kami akan segera menghubungi Anda kembali.</p>
              <Card>
                <CardContent className="p-8">
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <Label htmlFor="email">Alamat Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori Pertanyaan</Label>
                      <Select name="category">
                        <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Pertanyaan Umum</SelectItem>
                          <SelectItem value="billing">Penagihan</SelectItem>
                          <SelectItem value="delivery">Pengiriman</SelectItem>
                          <SelectItem value="feedback">Masukan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="message">Pesan Anda</Label>
                      <Textarea id="message" name="message" rows={5} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Kolom Kanan: Info Lokasi */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Kantor Pusat Kami</h3>
                <Card>
                  <div className="w-full h-64 bg-muted flex items-center justify-center rounded-t-lg">
                    <MapPin className="h-12 w-12 text-muted-foreground/50" />
                    <span className="sr-only">Peta Lokasi</span>
                  </div>
                  <CardContent className="p-6">
                    <p className="font-semibold text-foreground">SEA Catering HQ</p>
                    <p className="text-muted-foreground">Jl. Lingkar, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}