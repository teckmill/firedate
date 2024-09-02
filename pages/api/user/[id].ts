import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { User } from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';
import { validateProfile } from '../../../lib/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await dbConnect();

    const { id } = req.query;
    const userId = typeof id === 'string' ? id : id[0];

    if (req.method === 'GET') {
      const user = await User.findOne({ telegramId: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } else if (req.method === 'PUT') {
      const errors = validateProfile(req.body);
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const updatedUser = await User.findOneAndUpdate(
        { telegramId: userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}