import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ModerationTask } from '../../../models/ModerationTask';
import dbConnect from '../../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, bio } = req.body;

      const moderationTask = new ModerationTask({
        userId,
        contentType: 'bio',
        content: bio,
      });

      await moderationTask.save();

      res.status(200).json({ success: true, moderationTaskId: moderationTask._id });
    } catch (error) {
      res.status(500).json({ error: 'Error submitting bio for moderation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}