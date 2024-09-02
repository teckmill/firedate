import { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export default function handler(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  limiter(req, res, next);
}