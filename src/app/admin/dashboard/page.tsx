import { AdminDashboard } from "@/components/views/AdminDashboard";

export default function AdminDashboardPage() {
  // Middleware sudah memastikan hanya admin yang bisa mengakses halaman ini.
  // Kita langsung render komponen utamanya.
  return <AdminDashboard />;
}