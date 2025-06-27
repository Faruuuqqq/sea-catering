import { getMealPlans } from '@/lib/actions';
import MenuClientPage from '@/components/pages/MenuClientPage';

export default async function MenuPage() {
  const mealPlans = await getMealPlans();

  return <MenuClientPage mealPlans={mealPlans} />
}