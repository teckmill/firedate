import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ModerationTask } from '../../../../models/ModerationTask';
import { User } from '../../../../models/User';
import dbConnect from '../../../../lib/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.user.role === 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const { decision } = req.body;

      const task = await ModerationTask.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Moderation task not found' });
      }

      task.status = decision;
      task.moderatedBy = session.user.id;
      task.moderatedAt = new Date();
      await task.save();

      if (decision === 'approve') {
        // Update user's content if approved
        if (task.contentType === 'photo') {
          await User.findByIdAndUpdate(task.userId, { $push: { photos: task.content } });
        } else if (task.contentType === 'bio') {
          await User.findByIdAndUpdate(task.userId, { bio: task.content });
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error moderating content' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}