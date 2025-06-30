"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

  // Data untuk grafik: Pertumbuhan langganan 6 bulan terakhir
  const monthlySubsData = await prisma.$queryRaw<Array<{ month: string, count: bigint }>>`
    SELECT TO_CHAR(date_trunc('month', "createdAt"), 'YYYY-MM') as month, COUNT(id) as count
    FROM "Subscription"
    WHERE "createdAt" > date_trunc('month', NOW() - interval '6 month')
    GROUP BY month
    ORDER BY month ASC;
  `;
  
  // Konversi BigInt ke Number agar aman untuk client
  const subscriptionGrowth = monthlySubsData.map(d => ({
    month: new Date(d.month + '-01').toLocaleDateString('id-ID', { month: 'short' }),
    count: Number(d.count)
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
