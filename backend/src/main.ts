import { createServer } from './server';
import { setupRoutes } from './routes/';
import { scraperService } from './services/scraper.service';

const PORT = 3001;

const startServer = async () => {
  try {
    await scraperService.initialize();
    console.log('Puppeteer initialized');

    const app = createServer();
    
    setupRoutes(app);
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
    process.on('SIGINT', async () => {
      await scraperService.close();
      process.exit();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();