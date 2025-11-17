import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/plans', async (req, res) => {
  try {
    const plans = await prisma.plan.findMany();
    const parsedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features),
    }));
    res.json(parsedPlans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch plans', error: error.message });
  }
});

export default router;
