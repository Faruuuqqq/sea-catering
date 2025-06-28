import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserSubscriptions } from "@/lib/actions";
import Link from 'next/link';
import { SubscriptionList } from "@/components/pages/SubscriptionList";

export default async function DashboardPage() {
  const session = await auth();
  const subscriptions = await getUserSubscriptions();

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2 text-dark-green">Dashboard Saya</h1>
        <p className="text-lg text-text-main/80 mb-10">
          Selamat datang kembali, {session?.user?.name}!
        </p>

        <h2 className="text-2xl font-bold text-dark-green mb-6">Langganan Anda</h2>

        {subscriptions.length > 0 ? (
          <SubscriptionList subscriptions={subscriptions} />
        ) : (
          <div className="card text-center p-10">
            <p className="text-text-main mb-4">Anda belum memiliki langganan aktif.</p>
            <Link href="/subscription" className="btn btn-primary">Buat Langganan Baru</Link>
          </div>
        )}
      </div>
    </div>
  );
}