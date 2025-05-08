import { Express } from 'express';
import searchRouter from './search.routes';

export const setupRoutes = (app: Express) => {
  app.use('/search', searchRouter);

  app.get('/', (req, res) => {
    res.json({ 
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });
};