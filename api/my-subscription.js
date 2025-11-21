import prisma from '../_prisma.js';
import jwt from 'jsonwebtoken';

const verifyToken = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const decoded = verifyToken(authHeader);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = decoded.userId;
    const subscription = await prisma.subscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true },
    });

    if (!subscription) {
      return res.json(null);
    }

    res.status(200).json({
      id: subscription.id,
      planId: subscription.planId,
      name: subscription.plan.name,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      status: subscription.status,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscription', error: error.message });
  }
}
