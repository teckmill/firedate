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

  if (req.method === 'GET') {
    try {
      const userId = session.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.subscription !== 'premium') {
        return res.status(403).json({ error: 'Premium feature' });
      }

      const likes = await User.find({
        'swipes': {
          $elemMatch: {
            userId: userId,
            liked: true
          }
        }
      }).select('_id name photos');

      res.status(200).json(likes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching likes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}