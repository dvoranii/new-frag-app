import { Request, Response } from 'express';
import { scraperService } from '../services/scraper.service';

class SearchController {
  async searchFragrances(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Invalid query parameter' });
        return;
      }
  
      const results = await scraperService.searchFragrances(query);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }

  async selectFragrance(req: Request, res: Response): Promise<void> {
    try {
      const { itemId } = req.body;
      if (!itemId || typeof itemId !== 'string') {
        res.status(400).json({ error: 'Invalid itemId parameter' });
        return;
      }
  
      const url = await scraperService.selectFragrance(itemId);
      res.json({ url });
    } catch (error) {
      console.error('Selection error:', error);
      res.status(500).json({ error: 'Selection failed' });
    }
  }
}

export const searchController = new SearchController();