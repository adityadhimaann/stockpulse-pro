import { Request, Response } from 'express';
import { GeminiService } from '../../lib/geminiService';

const geminiService = new GeminiService();

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  content: string;
  category: 'market' | 'tech' | 'crypto' | 'economy' | 'earnings' | 'breaking';
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  source: string;
  impact: 'high' | 'medium' | 'low';
  relatedSymbols: string[];
}

// News generation prompts for different categories
const NEWS_PROMPTS = {
  market: `Generate a realistic stock market news article about current market conditions, trends, or major market movements. Include specific details about indices, sectors, and market sentiment.`,
  
  tech: `Generate a technology sector news article about a major tech company, innovation, or industry development that would impact stock prices. Focus on companies like Apple, Microsoft, Google, Meta, Tesla, etc.`,
  
  crypto: `Generate a cryptocurrency and blockchain technology news article that would impact crypto-related stocks and the broader financial market.`,
  
  economy: `Generate an economic news article about inflation, interest rates, GDP, employment, or other macroeconomic factors that impact the stock market.`,
  
  earnings: `Generate an earnings-related news article about a major company's quarterly results, guidance, or analyst updates that would move stock prices.`,
  
  breaking: `Generate a breaking financial news article about a significant event, merger, acquisition, regulatory change, or unexpected development in the financial markets.`
};

export class NewsService {
  async generateNews(category: keyof typeof NEWS_PROMPTS, count: number = 1): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const prompt = `${NEWS_PROMPTS[category]}

Please format your response as a JSON object with the following structure:
{
  "headline": "Clear, engaging headline (60-80 characters)",
  "summary": "Brief 2-3 sentence summary",
  "content": "Full article content (200-300 words)",
  "sentiment": "positive|negative|neutral",
  "impact": "high|medium|low",
  "relatedSymbols": ["SYMBOL1", "SYMBOL2"] (if applicable)
}

Requirements:
- Make it realistic and current
- Include specific numbers, percentages, or data points
- Mention relevant companies or economic indicators
- Ensure the content is factual-sounding but clearly generated
- Keep it professional and news-like in tone`;

        const result = await geminiService.generateContent(prompt);
        const responseText = result;
        
        // Parse the JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const articleData = JSON.parse(jsonMatch[0]);
          
          const article: NewsArticle = {
            id: `news_${Date.now()}_${i}`,
            headline: articleData.headline || 'Market Update',
            summary: articleData.summary || 'Market news summary',
            content: articleData.content || 'Market news content',
            category,
            sentiment: articleData.sentiment || 'neutral',
            timestamp: new Date().toISOString(),
            source: 'StockPulse AI News',
            impact: articleData.impact || 'medium',
            relatedSymbols: articleData.relatedSymbols || []
          };
          
          articles.push(article);
        }
      } catch (error) {
        console.error(`Error generating ${category} news:`, error);
        
        // Fallback article
        const fallbackArticle: NewsArticle = {
          id: `fallback_${Date.now()}_${i}`,
          headline: this.getFallbackHeadline(category),
          summary: this.getFallbackSummary(category),
          content: this.getFallbackContent(category),
          category,
          sentiment: 'neutral',
          timestamp: new Date().toISOString(),
          source: 'StockPulse AI News',
          impact: 'medium',
          relatedSymbols: this.getFallbackSymbols(category)
        };
        
        articles.push(fallbackArticle);
      }
    }
    
    return articles;
  }

  private getFallbackHeadline(category: string): string {
    const headlines = {
      market: 'Stock Markets Show Mixed Performance Amid Economic Uncertainty',
      tech: 'Technology Sector Continues Innovation Drive Despite Headwinds',
      crypto: 'Cryptocurrency Markets Experience Volatility Amid Regulatory Changes',
      economy: 'Economic Indicators Point to Continued Market Resilience',
      earnings: 'Corporate Earnings Season Reveals Mixed Results Across Sectors',
      breaking: 'Financial Markets React to Latest Economic Development'
    };
    return headlines[category as keyof typeof headlines] || 'Market Update';
  }

  private getFallbackSummary(category: string): string {
    const summaries = {
      market: 'Major indices showed mixed performance today as investors weighed economic data and corporate earnings reports.',
      tech: 'Technology companies continue to drive innovation while navigating challenging market conditions and regulatory scrutiny.',
      crypto: 'Digital asset markets experienced significant price movements following regulatory announcements and institutional developments.',
      economy: 'Latest economic data suggests continued resilience in key sectors despite ongoing global uncertainties.',
      earnings: 'Companies across various sectors reported quarterly results that met or exceeded analyst expectations.',
      breaking: 'A significant development in the financial markets has prompted investor attention and market response.'
    };
    return summaries[category as keyof typeof summaries] || 'Market news summary.';
  }

  private getFallbackContent(category: string): string {
    const content = {
      market: 'Stock markets displayed mixed signals today as investors processed a combination of economic data releases and corporate earnings reports. The broader market sentiment remains cautiously optimistic despite ongoing concerns about inflation and interest rate policies. Trading volumes were moderate across major exchanges.',
      tech: 'The technology sector continues to demonstrate resilience amid challenging market conditions. Major tech companies are focusing on artificial intelligence innovations and cloud computing solutions. Investors remain interested in companies with strong fundamentals and growth prospects.',
      crypto: 'Cryptocurrency markets experienced notable volatility following recent regulatory developments and institutional announcements. Bitcoin and Ethereum showed significant price movements as traders reacted to policy changes and adoption news from major financial institutions.',
      economy: 'Recent economic indicators suggest continued strength in key sectors of the economy. Employment data, consumer spending, and business investment metrics all point to underlying economic resilience despite global uncertainties and geopolitical tensions.',
      earnings: 'The current earnings season has revealed a mixed picture across different sectors. While some companies exceeded analyst expectations, others faced challenges from supply chain issues and changing consumer demand patterns. Overall corporate profitability remains stable.',
      breaking: 'A significant development in the financial markets has captured investor attention today. Market participants are closely monitoring the situation and its potential implications for various asset classes and trading strategies.'
    };
    return content[category as keyof typeof content] || 'Market news content.';
  }

  private getFallbackSymbols(category: string): string[] {
    const symbols = {
      market: ['SPY', 'QQQ', 'DIA'],
      tech: ['AAPL', 'MSFT', 'GOOGL', 'META'],
      crypto: ['COIN', 'MSTR', 'RIOT'],
      economy: ['SPY', 'TLT', 'GLD'],
      earnings: ['AAPL', 'TSLA', 'AMZN'],
      breaking: ['SPY', 'VIX']
    };
    return symbols[category as keyof typeof symbols] || [];
  }
}

const newsService = new NewsService();

// API Endpoints
export const generateNews = async (req: Request, res: Response) => {
  try {
    const { category = 'market', count = 5 } = req.query;
    
    if (!NEWS_PROMPTS[category as keyof typeof NEWS_PROMPTS]) {
      return res.status(400).json({ 
        error: 'Invalid category',
        validCategories: Object.keys(NEWS_PROMPTS)
      });
    }

    const articles = await newsService.generateNews(
      category as keyof typeof NEWS_PROMPTS, 
      Math.min(parseInt(count as string) || 5, 10) // Max 10 articles
    );

    res.json({
      success: true,
      articles,
      category,
      timestamp: new Date().toISOString(),
      total: articles.length
    });

  } catch (error) {
    console.error('News generation error:', error);
    res.status(500).json({
      error: 'Failed to generate news',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getNewsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { count = 3 } = req.query;

    if (!NEWS_PROMPTS[category as keyof typeof NEWS_PROMPTS]) {
      return res.status(400).json({ 
        error: 'Invalid category',
        validCategories: Object.keys(NEWS_PROMPTS)
      });
    }

    const articles = await newsService.generateNews(
      category as keyof typeof NEWS_PROMPTS, 
      Math.min(parseInt(count as string) || 3, 5) // Max 5 articles for specific category
    );

    res.json({
      success: true,
      articles,
      category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Category news error:', error);
    res.status(500).json({
      error: 'Failed to fetch category news',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getBreakingNews = async (req: Request, res: Response) => {
  try {
    const articles = await newsService.generateNews('breaking', 3);

    res.json({
      success: true,
      articles,
      type: 'breaking',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Breaking news error:', error);
    res.status(500).json({
      error: 'Failed to fetch breaking news',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
