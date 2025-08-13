import type { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await new Promise((resolve) => {
    cors(corsOptions)(req as any, res as any, resolve);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol, text } = req.body;

  if (!symbol || !text) {
    return res.status(400).json({ error: 'Symbol and text parameters are required' });
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Mock sentiment analysis for now - you can integrate with actual Gemini API
    const sentimentScore = Math.random() * 2 - 1; // Random between -1 and 1
    const sentiment = sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral';
    
    const analysis = {
      symbol,
      sentiment,
      score: sentimentScore,
      confidence: Math.random() * 0.3 + 0.7, // Random confidence between 0.7 and 1.0
      summary: `Market sentiment for ${symbol} appears ${sentiment} based on recent analysis.`,
      timestamp: new Date().toISOString(),
      factors: [
        'Market volatility',
        'Trading volume',
        'News sentiment',
        'Technical indicators'
      ]
    };

    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Sentiment API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze sentiment',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
