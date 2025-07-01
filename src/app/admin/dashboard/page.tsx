import { Suspense } from 'react';
import { AdminDashboard } from "@/components/views/AdminDashboard";
import { DashboardLoadingSkeleton } from "@/components/ui/DashboardLoadingSkeleton";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}