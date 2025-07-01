"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { getUserSubscriptions, pauseSubscription, cancelSubscription, reactivateSubscription } from "@/lib/actions/subscription.actions";
import type { Subscription, MealPlan } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, X, Calendar, Utensils, Truck, Package, DollarSign, AlertCircle } from "lucide-react";

type SubscriptionWithPlan = Subscription & { mealPlan: MealPlan };
type ServerActionResult = { success: boolean; message?: string };

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
  const { data: session, status } = useSession();

  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPlan[]>([]);
  const [isPending, startTransition] = useTransition();
  const [pauseDateRange, setPauseDateRange] = useState<DateRange | undefined>();

  const fetchSubscriptions = async () => {
    const userSubscriptions = await getUserSubscriptions();
    setSubscriptions(userSubscriptions);
  };

  useEffect(() => {
    if (status === 'authenticated') {
      startTransition(fetchSubscriptions);
    }
  }, [status]);

  const handleSimpleAction = (action: (id: number) => Promise<ServerActionResult>, id: number) => {
    startTransition(async () => {
      const result = await action(id);
      if (result.success) {
        toast.success("Status Diperbarui", { description: result.message });
        await fetchSubscriptions();
      } else {
        toast.error("Gagal", { description: result.message });
      }
    });
  };

  const handlePauseSubmit = (subscriptionId: number) => {
    if (!pauseDateRange?.from || !pauseDateRange?.to) {
      toast.error("Gagal", { description: "Silakan pilih rentang tanggal jeda." });
      return;
    }
    
    startTransition(async () => {
        const result = await pauseSubscription(subscriptionId, pauseDateRange.from!, pauseDateRange.to!);
        if (result.success) {
            toast.success("Langganan Dijeda", { description: result.message });
            await fetchSubscriptions();
        } else {
            toast.error("Gagal Menjeda", { description: result.message });
        }
    });
  };


  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    if (status === 'ACTIVE') return 'default';
    if (status === 'PAUSED') return 'secondary';
    return 'destructive';
  }

  if (status === 'loading' || (isPending && subscriptions.length === 0)) {
    return <LoadingSkeleton />;
  }

  const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE');
  const totalSpend = activeSubscriptions.reduce((sum, s) => sum + s.totalPrice, 0);

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {session?.user?.name}!</h1>
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
                      <Dialog onOpenChange={(open) => !open && setPauseDateRange(undefined)}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline" disabled={isPending}><Pause className="h-4 w-4 mr-2" /> Jeda</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Jeda Langganan</DialogTitle>
                                    <DialogDescription>Pilih rentang tanggal untuk menjeda langganan Anda.</DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center">
                                    <DayPicker
                                        mode="range"
                                        selected={pauseDateRange}
                                        onSelect={setPauseDateRange}
                                        fromDate={new Date()}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Batal</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button onClick={() => handlePauseSubmit(sub.id)} disabled={!pauseDateRange?.from || !pauseDateRange?.to || isPending}>
                                            {isPending ? "Menjeda..." : "Konfirmasi Jeda"}
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                      </Dialog>
                    )}
                    {sub.status === 'PAUSED' && (
                      <Button size="sm" variant="outline" onClick={() => handleSimpleAction(reactivateSubscription, sub.id)} disabled={isPending} className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"><Play className="h-4 w-4 mr-2" /> Aktifkan Kembali</Button>
                    )}
                    {sub.status !== 'CANCELED' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button size="sm" variant="destructive" disabled={isPending}><X className="h-4 w-4 mr-2" /> Batalkan</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Aksi ini akan membatalkan langganan Anda secara permanen.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleSimpleAction(cancelSubscription, sub.id)}>Ya, Batalkan</AlertDialogAction>
                          </AlertDialogFooter>
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