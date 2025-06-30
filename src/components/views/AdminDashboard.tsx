"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users, DollarSign, TrendingUp, Package, Activity } from "lucide-react";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { getAdminDashboardMetrics } from "@/lib/actions/admin.actions";
import { getAllSubscriptions } from "@/lib/actions/subscription.actions";
import { Skeleton } from "@/components/ui/skeleton";

type Metrics = Awaited<ReturnType<typeof getAdminDashboardMetrics>> | null;
type SubscriptionData = Awaited<ReturnType<typeof getAllSubscriptions>>;

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg mr-4"><Icon className="h-6 w-6 text-primary" /></div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
        </CardContent>
    </Card>
);

const LoadingSkeleton = () => (
    <div className="space-y-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Skeleton className="h-80 w-full" /><Skeleton className="h-80 w-full" /></div>
        <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
    </div>
);

function DashboardContent() {
  const searchParams = useSearchParams();
  const [metrics, setMetrics] = useState<Metrics>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : new Date(new Date().setDate(new Date().getDate() - 29));
    const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : new Date();

    setLoading(true);
    Promise.all([
      getAdminDashboardMetrics({ from, to }),
      getAllSubscriptions()
    ]).then(([metricsData, subsData]) => {
      setMetrics(metricsData);
      setSubscriptions(subsData);
    }).catch(error => {
      console.error("Error loading admin data:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [searchParams]);

  if (loading) return <LoadingSkeleton />;
  if (!metrics) return <p className="text-center py-20 text-destructive">Gagal memuat data metrik.</p>;

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    if (status === 'ACTIVE') return 'default';
    if (status === 'PAUSED') return 'secondary';
    return 'destructive';
  }

  return (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Revenue (MRR)" value={`Rp${metrics.mrr.toLocaleString('id-ID')}`} icon={DollarSign} />
        <StatCard title="New Subscriptions" value={metrics.newInRange} icon={Package} />
        <StatCard title="Active Subscriptions" value={metrics.activeSubscriptions} icon={Users} />
        <StatCard title="Cancellations" value={metrics.canceledInRange} icon={Activity} />
        <StatCard title="Total Growth" value={metrics.totalSubscriptions} icon={TrendingUp} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pertumbuhan Langganan</CardTitle>
          <CardDescription>Jumlah langganan baru dalam 6 bulan terakhir.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={metrics.subscriptionGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip formatter={(value: number) => [`${value} langganan`, "Baru"]} cursor={{fill: 'hsl(var(--primary), 0.1)'}} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Langganan Terbaru</CardTitle><CardDescription>Menampilkan 5 langganan terbaru.</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead><TableHead>Plan</TableHead>
                <TableHead>Status</TableHead><TableHead>Harga</TableHead><TableHead>Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.slice(0, 5).map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div className="font-medium">{sub.user.name}</div>
                    <div className="text-xs text-muted-foreground">{sub.user.email}</div>
                  </TableCell>
                  <TableCell>{sub.mealPlan.name}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(sub.status)}>{sub.status}</Badge></TableCell>
                  <TableCell>Rp{sub.totalPrice.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{new Date(sub.createdAt).toLocaleDateString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Komponen pembungkus utama
export function AdminDashboard() {
  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Pusat kendali untuk memonitor performa bisnis.</p>
          </div>
          <DateRangePicker />
        </div>
        <Suspense fallback={<LoadingSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
