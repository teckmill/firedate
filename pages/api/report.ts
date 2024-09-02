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
      const { reportedUserId, reason } = req.body;
      const reportingUserId = session.user.id;

      // Create a new report
      const report = {
        reportingUserId,
        reportedUserId,
        reason,
        timestamp: new Date(),
      };

      // Add the report to a Reports collection (you'll need to create this model)
      await Report.create(report);

      // Optionally, update the reported user's document
      await User.findByIdAndUpdate(reportedUserId, {
        $push: { reports: report },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Error submitting report' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}