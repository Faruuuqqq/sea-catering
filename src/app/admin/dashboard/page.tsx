import AdminDashboard from "@/components/pages/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10 text-dark-green">Admin Dashboard</h1>
        
        <AdminDashboard />
      </div>
    </div>
  );
}