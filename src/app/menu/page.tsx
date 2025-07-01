import { getMealPlans } from '@/lib/actions/subscription.actions';
import MenuClientPage from '@/components/views/MenuClientPage';

export default async function MenuPage() {

  const mealPlans = await getMealPlans();
  return <MenuClientPage mealPlans={mealPlans} />;
}