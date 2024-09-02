import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24*60*60*1000) } });
      // You'll need to implement a Matches model to count total matches
      const matches = 0; // Placeholder

      res.status(200).json({ totalUsers, activeUsers, matches });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stats' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}