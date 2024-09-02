import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../models/User';
import dbConnect from '../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, subscriptionType } = req.body;

      if (subscriptionType !== 'premium') {
        return res.status(400).json({ error: 'Invalid subscription type' });
      }

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1); // Set expiration to 1 month from now

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          subscription: 'premium',
          subscriptionExpiresAt: expirationDate
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: 'Error updating subscription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}