import { createServer } from './server';
import { setupRoutes } from './routes/';
import { scraperService } from './services/scraper.service';

const PORT = 3001;

const startServer = async () => {
  try {
    // Initialize Puppeteer
    await scraperService.initialize();
    console.log('Puppeteer initialized');
    
    // Create and configure Express app
    const app = createServer();
    
    // Setup routes
    setupRoutes(app);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
    // Clean up on server shutdown
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