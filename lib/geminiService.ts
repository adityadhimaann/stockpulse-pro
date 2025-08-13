import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning: string;
  keywords: string[];
  marketImpact: 'bullish' | 'bearish' | 'neutral';
  timeframe: 'short-term' | 'medium-term' | 'long-term';
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeSentiment(text: string, symbol?: string): Promise<SentimentAnalysis> {
    try {
      const prompt = this.buildSentimentPrompt(text, symbol);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      // Parse the structured response
      return this.parseSentimentResponse(analysisText);
    } catch (error) {
      console.error('Gemini sentiment analysis error:', error);
      
      // Fallback to basic sentiment analysis
      return this.fallbackSentimentAnalysis(text);
    }
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini content generation error:', error);
      throw error;
    }
  }

  private buildSentimentPrompt(text: string, symbol?: string): string {
    const symbolContext = symbol ? `related to stock symbol ${symbol.toUpperCase()}` : '';
    
    return `
You are a financial sentiment analysis expert. Analyze the following text ${symbolContext} and provide a JSON response with the following structure:

{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation of the sentiment",
  "keywords": ["key", "words", "that", "influenced", "sentiment"],
  "marketImpact": "bullish|bearish|neutral",
  "timeframe": "short-term|medium-term|long-term"
}

Guidelines:
- sentiment: Overall emotional tone (positive/negative/neutral)
- confidence: How confident you are in the analysis (0.0 to 1.0)
- reasoning: Brief explanation of why you assigned this sentiment
- keywords: 3-7 key words that influenced the sentiment
- marketImpact: Potential impact on stock/market (bullish/bearish/neutral)
- timeframe: Expected timeframe of impact (short-term: days, medium-term: weeks, long-term: months)

Text to analyze:
"${text.replace(/"/g, '\\"')}"

Respond only with valid JSON, no additional text.
`;
  }

  private parseSentimentResponse(response: string): SentimentAnalysis {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const sentiment = this.validateSentiment(parsedResponse.sentiment);
      const confidence = this.validateConfidence(parsedResponse.confidence);
      const marketImpact = this.validateMarketImpact(parsedResponse.marketImpact);
      const timeframe = this.validateTimeframe(parsedResponse.timeframe);

      return {
        sentiment,
        confidence,
        reasoning: parsedResponse.reasoning || 'No reasoning provided',
        keywords: Array.isArray(parsedResponse.keywords) 
          ? parsedResponse.keywords.slice(0, 7) 
          : [],
        marketImpact,
        timeframe
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      console.log('Raw response:', response);
      
      // Return basic sentiment based on keyword analysis
      return this.fallbackSentimentAnalysis(response);
    }
  }

  private validateSentiment(sentiment: any): 'positive' | 'negative' | 'neutral' {
    const validSentiments = ['positive', 'negative', 'neutral'];
    return validSentiments.includes(sentiment) ? sentiment : 'neutral';
  }

  private validateConfidence(confidence: any): number {
    const num = parseFloat(confidence);
    if (isNaN(num)) return 0.5;
    return Math.max(0, Math.min(1, num));
  }

  private validateMarketImpact(impact: any): 'bullish' | 'bearish' | 'neutral' {
    const validImpacts = ['bullish', 'bearish', 'neutral'];
    return validImpacts.includes(impact) ? impact : 'neutral';
  }

  private validateTimeframe(timeframe: any): 'short-term' | 'medium-term' | 'long-term' {
    const validTimeframes = ['short-term', 'medium-term', 'long-term'];
    return validTimeframes.includes(timeframe) ? timeframe : 'short-term';
  }

  private fallbackSentimentAnalysis(text: string): SentimentAnalysis {
    const positiveWords = [
      'good', 'great', 'excellent', 'positive', 'growth', 'profit', 'gain', 'rise', 'up', 
      'increase', 'strong', 'bullish', 'optimistic', 'success', 'outperform', 'beat', 
      'exceed', 'revenue', 'earnings', 'dividend', 'buy', 'upgrade', 'target'
    ];
    
    const negativeWords = [
      'bad', 'poor', 'negative', 'loss', 'decline', 'fall', 'down', 'decrease', 'weak', 
      'bearish', 'pessimistic', 'failure', 'underperform', 'miss', 'below', 'cut', 
      'downgrade', 'sell', 'concern', 'risk', 'warning', 'debt', 'bankruptcy'
    ];

    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    const foundKeywords: string[] = [];

    // Count positive words
    positiveWords.forEach(word => {
      const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
      if (matches > 0) {
        positiveScore += matches;
        foundKeywords.push(word);
      }
    });

    // Count negative words
    negativeWords.forEach(word => {
      const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
      if (matches > 0) {
        negativeScore += matches;
        foundKeywords.push(word);
      }
    });

    // Determine sentiment
    let sentiment: 'positive' | 'negative' | 'neutral';
    let marketImpact: 'bullish' | 'bearish' | 'neutral';
    let confidence: number;

    if (positiveScore > negativeScore) {
      sentiment = 'positive';
      marketImpact = 'bullish';
      confidence = Math.min(0.8, 0.5 + (positiveScore - negativeScore) * 0.1);
    } else if (negativeScore > positiveScore) {
      sentiment = 'negative';
      marketImpact = 'bearish';
      confidence = Math.min(0.8, 0.5 + (negativeScore - positiveScore) * 0.1);
    } else {
      sentiment = 'neutral';
      marketImpact = 'neutral';
      confidence = 0.3;
    }

    return {
      sentiment,
      confidence,
      reasoning: `Fallback analysis based on keyword count: ${positiveScore} positive, ${negativeScore} negative`,
      keywords: foundKeywords.slice(0, 5),
      marketImpact,
      timeframe: 'short-term'
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Test message');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }
}

export default GeminiService;
