import { auth } from "@/app/api/auth/[...nextauth]/route";
import { getUserSubscriptions } from "@/lib/actions";
import Link from 'next/link';

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
          <div className="grid gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="card !flex-row items-center justify-between p-6">
                <div>
                  <h3 className="text-xl font-bold text-dark-green">{sub.mealPlan.name}</h3>
                  <p className="text-text-main">
                    Total: <span className="font-semibold">Rp{sub.totalPrice.toLocaleString('id-ID')}</span>/bulan
                  </p>
                  <p className="text-sm text-text-main/70 mt-2">
                    Status: 
                    <span className={`font-semibold ml-2 px-2 py-1 rounded-full text-xs
                      ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                      ${sub.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${sub.status === 'CANCELED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {sub.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button disabled className="btn btn-secondary !py-2 !px-4 text-sm disabled:bg-gray-300">Jeda</button>
                  <button disabled className="btn !bg-red-600 !text-white hover:!bg-red-700 !py-2 !px-4 text-sm disabled:bg-gray-300">Batal</button>
                </div>
              </div>
            ))}
          </div>
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