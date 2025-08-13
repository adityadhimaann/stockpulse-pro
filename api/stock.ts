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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { symbol } = req.query;

  if (!symbol || typeof symbol !== 'string') {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Fetch real-time stock data
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();

    if (data['Error Message']) {
      return res.status(404).json({ error: 'Stock symbol not found' });
    }

    const quote = data['Global Quote'];
    
    if (!quote) {
      return res.status(404).json({ error: 'No data available for this symbol' });
    }

    // Format the response
    const stockData = {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'],
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(stockData);
  } catch (error) {
    console.error('Stock API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch stock data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
