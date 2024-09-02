import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
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
      const userId = session.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const secret = speakeasy.generateSecret({ name: 'Your Dating App' });
      user.twoFactorSecret = secret.base32;
      await user.save();

      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: 'Your Dating App',
        issuer: 'Your Company'
      });

      const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

      res.status(200).json({ qrCodeDataUrl, secret: secret.base32 });
    } catch (error) {
      res.status(500).json({ error: 'Error setting up 2FA' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}