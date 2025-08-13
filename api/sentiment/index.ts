import express from 'express';
import { GeminiService } from '../../lib/geminiService';
import { CacheService } from '../../lib/cacheService';

const router = express.Router();
const geminiService = new GeminiService();
const cacheService = new CacheService();

// POST /api/sentiment/analyze - Analyze sentiment of text
router.post('/analyze', async (req, res) => {
  try {
    const { text, symbol } = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text is required and must be a string'
      });
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text too long',
        message: 'Text must be less than 5000 characters'
      });
    }

    // Create cache key based on text hash (simple approach)
    const textHash = Buffer.from(text).toString('base64').slice(0, 20);
    const cacheKey = `sentiment_${textHash}`;
    
    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Analyze sentiment using Gemini
    const sentimentResult = await geminiService.analyzeSentiment(text, symbol);
    
    // Cache the result
    cacheService.set(cacheKey, sentimentResult, 3600000); // 1 hour

    res.json({
      ...sentimentResult,
      cached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze sentiment'
    });
  }
});

// POST /api/sentiment/batch - Analyze sentiment for multiple texts
router.post('/batch', async (req, res) => {
  try {
    const { articles } = req.body;

    // Validate input
    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Articles must be a non-empty array'
      });
    }

    if (articles.length > 10) {
      return res.status(400).json({
        error: 'Too many articles',
        message: 'Maximum 10 articles per batch request'
      });
    }

    // Validate each article
    for (const article of articles) {
      if (!article.text || typeof article.text !== 'string') {
        return res.status(400).json({
          error: 'Invalid article',
          message: 'Each article must have a text field'
        });
      }
      if (article.text.length > 2000) {
        return res.status(400).json({
          error: 'Article too long',
          message: 'Each article text must be less than 2000 characters'
        });
      }
    }

    // Process articles in parallel
    const results = await Promise.allSettled(
      articles.map(async (article, index) => {
        try {
          const textHash = Buffer.from(article.text).toString('base64').slice(0, 20);
          const cacheKey = `sentiment_${textHash}`;
          
          // Check cache first
          const cachedData = cacheService.get(cacheKey);
          if (cachedData) {
            return {
              index,
              ...cachedData,
              cached: true
            };
          }

          // Analyze sentiment
          const sentimentResult = await geminiService.analyzeSentiment(
            article.text, 
            article.symbol
          );
          
          // Cache the result
          cacheService.set(cacheKey, sentimentResult, 3600000); // 1 hour

          return {
            index,
            ...sentimentResult,
            cached: false
          };
        } catch (error) {
          console.error(`Sentiment analysis failed for article ${index}:`, error);
          return {
            index,
            error: 'Analysis failed',
            sentiment: 'neutral',
            confidence: 0,
            reasoning: 'Failed to analyze'
          };
        }
      })
    );

    // Process results
    const processedResults = results.map((result, index) => ({
      index,
      ...(result.status === 'fulfilled' ? result.value : {
        error: 'Analysis failed',
        sentiment: 'neutral',
        confidence: 0,
        reasoning: 'Failed to analyze'
      })
    }));

    res.json({
      results: processedResults,
      total: articles.length,
      successful: processedResults.filter(r => !r.error).length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Batch Sentiment Analysis Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to analyze sentiment for batch'
    });
  }
});

// GET /api/sentiment/health - Health check for sentiment service
router.get('/health', async (req, res) => {
  try {
    // Test basic sentiment analysis
    const testResult = await geminiService.analyzeSentiment('This is a test message.');
    
    res.json({
      status: 'healthy',
      service: 'sentiment-analysis',
      gemini_api: testResult ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sentiment Service Health Check Failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'sentiment-analysis',
      gemini_api: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
