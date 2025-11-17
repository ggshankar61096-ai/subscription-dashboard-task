import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Seed Plans
  const plans = [
    {
      name: 'Basic',
      price: 9.99,
      features: JSON.stringify(['Up to 10 GB storage', 'Email support', 'Basic analytics']),
      duration: 30,
    },
    {
      name: 'Professional',
      price: 29.99,
      features: JSON.stringify(['Up to 100 GB storage', 'Priority email support', 'Advanced analytics', 'Custom reports']),
      duration: 30,
    },
    {
      name: 'Enterprise',
      price: 99.99,
      features: JSON.stringify(['Unlimited storage', '24/7 phone support', 'Real-time analytics', 'Custom integrations', 'Dedicated account manager']),
      duration: 30,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.create({ data: plan });
  }

  console.log('✓ Plans seeded');

  // Seed Admin User
  const adminPassword = await bcryptjs.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  console.log('✓ Admin user seeded:', admin.email);

  // Seed Regular User
  const userPassword = await bcryptjs.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
    },
  });

  console.log('✓ Regular user seeded:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
