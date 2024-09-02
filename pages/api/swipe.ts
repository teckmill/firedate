import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../models/User';
import dbConnect from '../../lib/dbConnect';

const DAILY_SWIPE_LIMIT = 100; // Limit for free users

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, matchedUserId, liked } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check swipe limit for free users
      if (user.subscription !== 'premium') {
        const today = new Date().setHours(0, 0, 0, 0);
        const swipesCount = user.swipes.filter(swipe => swipe.timestamp >= today).length;
        if (swipesCount >= DAILY_SWIPE_LIMIT) {
          return res.status(403).json({ error: 'Daily swipe limit reached' });
        }
      }

      // Record the swipe
      await User.findByIdAndUpdate(userId, {
        $push: { swipes: { userId: matchedUserId, liked, timestamp: new Date() } }
      });

      // Check for mutual like
      if (liked) {
        const matchedUser = await User.findById(matchedUserId);
        const mutualLike = matchedUser.swipes.find(
          (swipe: { userId: string; liked: boolean }) => 
            swipe.userId === userId && swipe.liked
        );

        if (mutualLike) {
          // Create a match
          // You might want to create a separate Match model for this
          console.log(`Match created between ${userId} and ${matchedUserId}`);
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error recording swipe' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}