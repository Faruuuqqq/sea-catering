import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardLoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Skeleton untuk Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
    {/* Skeleton untuk Daftar Langganan */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </div>
);