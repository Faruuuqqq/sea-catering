"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";

import { getUserSubscriptions, pauseSubscription, cancelSubscription, reactivateSubscription } from "@/lib/actions/subscription.actions";
import type { Subscription, MealPlan } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, X, Calendar, Utensils, Truck, Package, DollarSign, AlertCircle } from "lucide-react";

type SubscriptionWithPlan = Subscription & { mealPlan: MealPlan };

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex items-center">
        <div className="p-3 bg-primary/10 rounded-lg mr-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
);

const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-1/3 mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 w-full" /><Skeleton className="h-72 w-full" />
      </div>
    </div>
);

export function UserDashboard() {
  const { data: status } = useSession();
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPlan[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (status === 'authenticated') {
      startTransition(async () => {
        const userSubscriptions = await getUserSubscriptions();
        setSubscriptions(userSubscriptions as SubscriptionWithPlan[]);
      });
    }
  }, [status]);

  const handleAction = (action: (id: number, ...args: any[]) => Promise<any>, id: number) => {
    startTransition(async () => {
      const result = await action(id, new Date(), new Date());
      if (result.success) {
        toast.success("Status Diperbarui", { description: result.message });
        const updatedSubs = await getUserSubscriptions();
        setSubscriptions(updatedSubs as SubscriptionWithPlan[]);
      } else {
        toast.error("Gagal", { description: result.message });
      }
    });
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    if (status === 'ACTIVE') return 'default';
    if (status === 'PAUSED') return 'secondary';
    return 'destructive';
  }

  if (status === 'loading' || (isPending && subscriptions.length === 0)) return <LoadingSkeleton />;
  
  const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE');
  const totalSpend = activeSubscriptions.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Saya</h1>
          <p className="text-muted-foreground mt-1">Kelola semua langganan dan preferensi Anda di satu tempat.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Langganan Aktif" value={activeSubscriptions.length} icon={Package} />
          <StatCard title="Pengeluaran Bulanan" value={`Rp${totalSpend.toLocaleString('id-ID')}`} icon={DollarSign} />
          <StatCard title="Total Langganan" value={subscriptions.length} icon={Calendar} />
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Daftar Langganan Anda</h2>
            <Button asChild><Link href="/subscription">Langganan Baru</Link></Button>
          </div>
          {subscriptions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subscriptions.map((sub) => (
                <Card key={sub.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{sub.mealPlan.name}</CardTitle>
                        <CardDescription>ID: SUB-{sub.id}</CardDescription>
                      </div>
                      <Badge variant={getStatusBadgeVariant(sub.status)}>{sub.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <p className="font-bold text-3xl text-primary">Rp{sub.totalPrice.toLocaleString('id-ID')}<span className="text-sm font-normal text-muted-foreground">/bulan</span></p>
                    <div className="text-sm space-y-3 text-muted-foreground border-t pt-4">
                        <div className="flex items-center"><Utensils className="h-4 w-4 mr-2 text-primary" /> <strong>Tipe Makanan:</strong><span className="ml-2">{sub.mealTypes.join(', ')}</span></div>
                        <div className="flex items-center"><Truck className="h-4 w-4 mr-2 text-primary" /> <strong>Hari Pengiriman:</strong><span className="ml-2">{sub.deliveryDays.join(', ')}</span></div>
                        {sub.allergies && <div className="flex items-start"><AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-destructive" /> <strong>Alergi:</strong><span className="ml-2">{sub.allergies}</span></div>}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-secondary/50 p-4 flex gap-2 border-t">
                    {sub.status === 'ACTIVE' && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(pauseSubscription, sub.id)} disabled={isPending}><Pause className="h-4 w-4 mr-2" /> Jeda</Button>
                    )}
                    {sub.status === 'PAUSED' && (
                      <Button size="sm" variant="outline" onClick={() => handleAction(reactivateSubscription, sub.id)} disabled={isPending} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"><Play className="h-4 w-4 mr-2" /> Aktifkan Kembali</Button>
                    )}
                    {sub.status !== 'CANCELED' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="sm" variant="destructive" disabled={isPending}><X className="h-4 w-4 mr-2" /> Batalkan</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Aksi ini akan membatalkan langganan Anda secara permanen.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleAction(cancelSubscription, sub.id)}>Ya, Batalkan</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16"><CardContent><p>Anda belum memiliki langganan.</p><Button asChild className="mt-4"><Link href="/subscription">Buat Langganan Pertama Anda</Link></Button></CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
}
