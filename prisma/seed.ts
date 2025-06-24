import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  await prisma.mealPlan.createMany({
    data: [
      { name: 'Diet Plan', price: 30000, description: 'Rendah kalori, kaya serat, untuk program penurunan berat badan.', image: '/images/diet-plan.jpg', details: 'Sekitar 350-450 kalori. Fokus pada sayuran segar dan protein tanpa lemak.' },
      { name: 'Protein Plan', price: 40000, description: 'Tinggi protein untuk membangun massa otot setelah olahraga.', image: '/images/protein-plan.jpg', details: 'Mengandung 30-40g protein. Menggunakan dada ayam, ikan salmon, dan daging rendah lemak.' },
      { name: 'Royal Plan', price: 60000, description: 'Menu premium dengan bahan organik dari chef ternama.', image: '/images/royal-plan.jpg', details: 'Pengalaman makan mewah. Menggunakan bahan impor berkualitas tinggi.' },
    ],
    skipDuplicates: true,
  });
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