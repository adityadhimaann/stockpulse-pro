import type { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

// Enable CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  await new Promise((resolve) => {
    cors(corsOptions)(req as any, res as any, resolve);
  });

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'StockPulse Pro API'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
