import prisma from './_prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const plans = await prisma.plan.findMany();
    const parsed = plans.map(p => ({ ...p, features: JSON.parse(p.features) }));
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch plans', error: err.message });
  }
}
