import { UserDashboard } from "@/components/views/UserDashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <UserDashboard />
      </main>
    </div>
  )
}