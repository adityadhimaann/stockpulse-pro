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

  try {
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Fetch market news
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}&limit=20`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch news data');
    }

    const data = await response.json();

    if (data['Error Message']) {
      return res.status(404).json({ error: 'Failed to fetch news' });
    }

    // Format the news data
    const news = data.feed?.slice(0, 10).map((item: any) => ({
      title: item.title,
      summary: item.summary,
      url: item.url,
      source: item.source,
      publishedAt: item.time_published,
      sentiment: {
        score: parseFloat(item.overall_sentiment_score || 0),
        label: item.overall_sentiment_label || 'neutral'
      },
      topics: item.topics?.map((topic: any) => ({
        topic: topic.topic,
        relevance: parseFloat(topic.relevance_score)
      })) || []
    })) || [];

    return res.status(200).json({
      news,
      timestamp: new Date().toISOString(),
      total: news.length
    });
  } catch (error) {
    console.error('News API Error:', error);
    
    // Return mock data if API fails
    const mockNews = [
      {
        title: "Market Analysis: Tech Stocks Show Strong Performance",
        summary: "Technology stocks continue to lead market gains amid positive earnings reports.",
        url: "#",
        source: "Market Watch",
        publishedAt: new Date().toISOString(),
        sentiment: { score: 0.7, label: "positive" },
        topics: [{ topic: "Technology", relevance: 0.9 }]
      },
      {
        title: "Federal Reserve Maintains Interest Rates",
        summary: "The Fed decided to keep interest rates unchanged in latest meeting.",
        url: "#",
        source: "Financial Times",
        publishedAt: new Date().toISOString(),
        sentiment: { score: 0.1, label: "neutral" },
        topics: [{ topic: "Monetary Policy", relevance: 0.95 }]
      }
    ];

    return res.status(200).json({
      news: mockNews,
      timestamp: new Date().toISOString(),
      total: mockNews.length,
      note: "Displaying mock data due to API limitations"
    });
  }
}
