"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAdminDashboardMetrics } from '@/lib/actions';
import { DateRangePicker } from '@/components/ui/DateRangePicker';

// Tipe untuk data metrik kita
type Metrics = Awaited<ReturnType<typeof getAdminDashboardMetrics>>;

// Komponen kecil untuk kartu statistik
const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="card">
    <div className="card-body">
      <h3 className="text-text-main/80">{title}</h3>
      <p className="text-4xl font-bold text-dark-green mt-2">{value}</p>
    </div>
  </div>
);

// Komponen Loading
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="card h-32 bg-gray-200 animate-pulse"></div>
    ))}
  </div>
);

function DashboardContent() {
  const searchParams = useSearchParams();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil tanggal dari URL, atau set default jika tidak ada
    const fromParam = searchParams.get('from') || new Date(new Date().setDate(new Date().getDate() - 29)).toISOString();
    const toParam = searchParams.get('to') || new Date().toISOString();
    
    const from = new Date(fromParam);
    const to = new Date(toParam);

    setLoading(true);
    getAdminDashboardMetrics({ from, to })
      .then(data => {
        setMetrics(data);
      })
      .catch(err => {
        console.error("Failed to fetch admin metrics:", err);
        // Di aplikasi nyata, tampilkan pesan error ke pengguna
      })
      .finally(() => {
        setLoading(false);
      });
  // Kita trigger useEffect ini setiap kali searchParams berubah
  }, [searchParams]);

  return (
    <>
      <div className="mb-8">
        <DateRangePicker />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Monthly Recurring Revenue (MRR)" value={`Rp${metrics.mrr.toLocaleString('id-ID')}`} />
          <StatCard title="Langganan Aktif" value={metrics.activeSubscriptions} />
          <StatCard title="Total Langganan (Pertumbuhan)" value={metrics.totalSubscriptions} />
          <StatCard title="Langganan Baru (Rentang Dipilih)" value={metrics.newInRange} />
          <StatCard title="Pembatalan (Rentang Dipilih)" value={metrics.canceledInRange} />
        </div>
      ) : (
        <p className="text-center text-red-500">Gagal memuat data metrik.</p>
      )}
    </>
  );
}

// Komponen utama yang akan kita ekspor
export default function AdminDashboard() {
  return (
    // Suspense diperlukan oleh Next.js saat menggunakan useSearchParams
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}