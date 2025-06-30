import { SubscriptionForm } from "@/components/forms/SubscriptionForm";

export default function SubscriptionPage() {
  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="py-20 text-center bg-background">
        <div className="container">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Berlangganan SEA Catering</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Pilih paket yang sempurna untuk Anda dan biarkan kami mengurus sisanya. Makanan sehat dan lezat diantar langsung ke depan pintu Anda.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
          <SubscriptionForm />
      </section>
    </div>
  );
}
