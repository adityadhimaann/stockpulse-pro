import express from 'express';
import { AlphaVantageService } from '../../lib/alphaVantageService';
import { CacheService } from '../../lib/cacheService';

const router = express.Router();
const alphaVantageService = new AlphaVantageService();
const cacheService = new CacheService();

// GET /api/stock/:symbol - Get detailed stock information
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const cacheKey = `stock_${symbol.toUpperCase()}`;
    
    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Validate symbol
    if (!symbol || symbol.length > 10) {
      return res.status(400).json({
        error: 'Invalid stock symbol',
        message: 'Symbol must be 1-10 characters long'
      });
    }

    // Fetch stock data from Alpha Vantage
    const [quote, overview, intraday] = await Promise.allSettled([
      alphaVantageService.getQuote(symbol),
      alphaVantageService.getOverview(symbol),
      alphaVantageService.getIntraday(symbol)
    ]);

    // Process results
    const stockData: any = {
      symbol: symbol.toUpperCase(),
      timestamp: new Date().toISOString()
    };

    if (quote.status === 'fulfilled') {
      stockData.quote = quote.value;
    } else {
      console.warn(`Quote fetch failed for ${symbol}:`, quote.reason);
    }

    if (overview.status === 'fulfilled') {
      stockData.overview = overview.value;
    } else {
      console.warn(`Overview fetch failed for ${symbol}:`, overview.reason);
    }

    if (intraday.status === 'fulfilled') {
      stockData.chartData = intraday.value;
    } else {
      console.warn(`Intraday fetch failed for ${symbol}:`, intraday.reason);
    }

    // If no data was fetched successfully, return error
    if (!stockData.quote && !stockData.overview) {
      return res.status(404).json({
        error: 'Stock not found',
        message: `Unable to fetch data for symbol: ${symbol}`
      });
    }

    // Cache the result
    cacheService.set(cacheKey, stockData, 300000); // 5 minutes

    res.json({
      ...stockData,
      cached: false
    });

  } catch (error) {
    console.error('Stock API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch stock data'
    });
  }
});

// GET /api/stock/:symbol/chart/:interval - Get chart data with specific interval
router.get('/:symbol/chart/:interval', async (req, res) => {
  try {
    const { symbol, interval } = req.params;
    const cacheKey = `chart_${symbol.toUpperCase()}_${interval}`;
    
    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        symbol: symbol.toUpperCase(),
        interval,
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Validate parameters
    const validIntervals = ['1min', '5min', '15min', '30min', '60min'];
    if (!validIntervals.includes(interval)) {
      return res.status(400).json({
        error: 'Invalid interval',
        message: 'Interval must be one of: ' + validIntervals.join(', ')
      });
    }

    // Fetch chart data
    const chartData = await alphaVantageService.getIntraday(symbol, interval);
    
    // Cache the result
    cacheService.set(cacheKey, chartData, 60000); // 1 minute for chart data

    res.json({
      symbol: symbol.toUpperCase(),
      interval,
      data: chartData,
      cached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chart API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch chart data'
    });
  }
});

// GET /api/stock/market/movers - Get market movers (gainers, losers, most active)
router.get('/market/movers', async (req, res) => {
  try {
    const cacheKey = 'market_movers';
    
    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    // Fetch market movers
    const movers = await alphaVantageService.getTopGainersLosers();
    
    // Cache the result
    cacheService.set(cacheKey, movers, 300000); // 5 minutes

    res.json({
      ...movers,
      cached: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Market Movers API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch market movers'
    });
  }
});

export default router;
