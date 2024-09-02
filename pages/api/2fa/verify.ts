import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import speakeasy from 'speakeasy';
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
      const { token } = req.body;
      const userId = session.user.id;
      const user = await User.findById(userId);

      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ error: 'Two-factor authentication not set up' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token
      });

      if (verified) {
        user.twoFactorEnabled = true;
        await user.save();
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ error: 'Invalid token' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error verifying 2FA token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}