import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../models/User';
import dbConnect from '../../lib/dbConnect';
import { findMatches } from '../../lib/matchmaking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      const currentUser = await User.findOne({ telegramId: session.user.id });
      if (!currentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const potentialMatches = await User.find({
        telegramId: { $ne: currentUser.telegramId },
        // Add more filtering criteria based on user preferences
      });

      const matches = findMatches(currentUser, potentialMatches);
      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching matches' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}