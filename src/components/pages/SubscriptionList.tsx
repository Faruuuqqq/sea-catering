"use client";

import { pauseSubscription, cancelSubscription } from "@/lib/actions";
import { useTransition } from "react";

type SubscriptionWithPlan = Awaited<ReturnType<typeof import('@/lib/actions').getUserSubscriptions>>[0];

export const SubscriptionList = ({ subscriptions }: { subscriptions: SubscriptionWithPlan[] }) => {
  const [isPending, startTransition] = useTransition();
  
  const handleAction = (action: (id: number) => Promise<any>, id: number) => {
    startTransition(async () => {
      const result = await action(id);
      if (result.message) {
        alert(result.message);
      }
    });
  };

  return (
    <div className="grid gap-6">
      {subscriptions.map((sub) => (
        <div key={sub.id} className="card !flex-row items-center justify-between p-6">
          <div>
            <h3 className="text-xl font-bold text-dark-green">{sub.mealPlan.name}</h3>
            <p className="text-text-main">
              Total: <span className="font-semibold">Rp{sub.totalPrice.toLocaleString('id-ID')}</span>/bulan
            </p>
            <p className="text-sm text-text-main/70 mt-2">
              Status:
              <span className={`font-semibold ml-2 px-2 py-1 rounded-full text-xs
                ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                ${sub.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${sub.status === 'CANCELED' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {sub.status}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <form action={() => handleAction(pauseSubscription, sub.id)}>
              <button type="submit" disabled={isPending || sub.status !== 'ACTIVE'} className="btn btn-secondary !py-2 !px-4 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
                {isPending ? "..." : "Jeda"}
              </button>
            </form>
            <form action={() => handleAction(cancelSubscription, sub.id)}>
              <button type="submit" disabled={isPending || sub.status === 'CANCELED'} className="btn !bg-red-600 !text-white hover:!bg-red-700 !py-2 !px-4 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
                {isPending ? "..." : "Batal"}
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};