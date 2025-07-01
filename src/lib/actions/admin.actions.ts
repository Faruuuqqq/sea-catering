"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper untuk mendapatkan nomor minggu dari sebuah tanggal
declare global {
    interface Date {
        getWeek(): number;
    }
}

Date.prototype.getWeek = function() {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}


export async function getAdminDashboardMetrics({ from, to }: { from: Date; to: Date }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Akses ditolak: Hanya admin yang dapat melihat halaman ini.");
  }

  const whereClause = { createdAt: { gte: from, lte: to } };

  const newInRange = await prisma.subscription.count({ where: whereClause });
  const canceledInRange = await prisma.subscription.count({
    where: { status: 'CANCELED', updatedAt: { gte: from, lte: to } }
  });

  const totalSubscriptions = await prisma.subscription.count();
  const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
  
  const mrrData = await prisma.subscription.aggregate({
    _sum: { totalPrice: true },
    where: { status: 'ACTIVE' },
  });

  // PERBAIKAN: Data untuk grafik: Pertumbuhan langganan 12 MINGGU terakhir
  const weeklySubsData = await prisma.$queryRaw<Array<{ week_start: Date, count: bigint }>>`
    SELECT date_trunc('week', "createdAt") as week_start, COUNT(id) as count
    FROM "Subscription"
    WHERE "createdAt" > date_trunc('week', NOW() - interval '12 week')
    GROUP BY week_start
    ORDER BY week_start ASC;
  `;
  
  // Format data agar siap digunakan oleh Recharts
  const subscriptionGrowth = weeklySubsData.map(d => ({
    week: `W${new Date(d.week_start).getWeek()}`, // Format label menjadi "W25", "W26", dst.
    "Langganan Baru": Number(d.count)
  }));

  return {
    totalSubscriptions,
    activeSubscriptions,
    newInRange,
    mrr: mrrData._sum.totalPrice || 0,
    canceledInRange,
    subscriptionGrowth,
  };
}
