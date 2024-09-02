import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { blockedUserId } = req.body;
      const userId = session.user.id;

      await User.findByIdAndUpdate(userId, {
        $addToSet: { blockedUsers: blockedUserId }
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error blocking user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}