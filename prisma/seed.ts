import { PrismaClient, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const dietPlan = await prisma.mealPlan.upsert({
    where: { name: 'Diet Plan' },
    update: {},
    create: {
      name: 'Diet Plan',
      price: 30000,
      description: 'Rendah kalori, kaya serat, untuk program penurunan berat badan.',
      image: '/images/diet-plan.jpg',
      details: 'Sekitar 350-450 kalori. Fokus pada sayuran segar dan protein tanpa lemak.'
    },
  });

  const proteinPlan = await prisma.mealPlan.upsert({
    where: { name: 'Protein Plan' },
    update: {},
    create: {
      name: 'Protein Plan',
      price: 40000,
      description: 'Tinggi protein untuk membangun massa otot setelah olahraga.',
      image: '/images/protein-plan.jpg',
      details: 'Mengandung 30-40g protein. Menggunakan dada ayam, ikan salmon, dan daging rendah lemak.'
    },
  });

  const royalPlan = await prisma.mealPlan.upsert({
    where: { name: 'Royal Plan' },
    update: {},
    create: {
      name: 'Royal Plan',
      price: 60000,
      description: 'Menu premium dengan bahan organik dari chef ternama.',
      image: '/images/royal-plan.jpg',
      details: 'Pengalaman makan mewah. Menggunakan bahan impor berkualitas tinggi.'
    },
  });

  console.log('Meal Plans seeded.');

  const hashedPasswordAdmin = await bcrypt.hash('passwordadmin', 10);
  const hashedPasswordUser = await bcrypt.hash('passworduser', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@seacatering.com' },
    update: {},
    create: {
      name: 'Admin SEA',
      email: 'admin@seacatering.com',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@seacatering.com' },
    update: {},
    create: {
      name: 'User Biasa',
      email: 'user@seacatering.com',
      password: hashedPasswordUser,
      role: 'USER',
    },
  });

  console.log('Users seeded.');
  console.log('--- Login Credentials ---');
  console.log('Admin: admin@seacatering.com / passwordadmin');
  console.log('User:  user@seacatering.com / passworduser');
  console.log('-------------------------');

  await prisma.subscription.createMany({
    data: [
      {
        customerName: adminUser.name!,
        customerPhone: '081234567890',
        mealPlanId: proteinPlan.id,
        userId: adminUser.id,
        mealTypes: ['Lunch', 'Dinner'],
        deliveryDays: ['Monday', 'Wednesday', 'Friday'],
        totalPrice: 40000 * 2 * 3 * 4.3,
        status: SubscriptionStatus.ACTIVE,
      },
      {
        customerName: regularUser.name!,
        customerPhone: '089876543210',
        mealPlanId: dietPlan.id,
        userId: regularUser.id,
        mealTypes: ['Breakfast', 'Lunch'],
        deliveryDays: ['Tuesday', 'Thursday'],
        totalPrice: 30000 * 2 * 2 * 4.3,
        allergies: 'Alergi kacang',
        status: SubscriptionStatus.PAUSED,
        pauseStartDate: new Date(),
        pauseEndDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
      {
        customerName: regularUser.name!,
        customerPhone: '089876543210',
        mealPlanId: royalPlan.id,
        userId: regularUser.id,
        mealTypes: ['Dinner'],
        deliveryDays: ['Saturday', 'Sunday'],
        totalPrice: 60000 * 1 * 2 * 4.3,
        allergies: 'Tidak suka bawang bombay',
        status: SubscriptionStatus.ACTIVE,
      }
    ],
    skipDuplicates: true,
  });

  console.log('Subscriptions seeded.');

  await prisma.testimonial.createMany({
    data: [
      {
        name: regularUser.name!,
        review: 'Makanannya enak-enak dan sangat membantu program diet saya! Pengirimannya juga selalu tepat waktu. Highly recommended!',
        rating: 5,
      },
      {
        name: 'Pelanggan Lain',
        review: 'Pilihan menunya variatif dan tidak membosankan. Akhirnya ada katering sehat yang rasanya tidak hambar.',
        rating: 4,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Testimonials seeded.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });