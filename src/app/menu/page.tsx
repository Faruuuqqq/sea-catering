import { getMealPlans } from '@/lib/actions/subscription.actions'; // Pastikan path ini benar
import MenuClientPage from '@/components/views/MenuClientPage'; // Pastikan path ini benar

export default async function MenuPage() {
  // 1. Ambil data di server
  const mealPlans = await getMealPlans();

  // 2. Berikan data sebagai prop ke komponen client
  return <MenuClientPage mealPlans={mealPlans} />;
}