import * as Puppeteer from 'puppeteer';
import { Fragrance } from '../types';

class ScraperService {
  private browser: Puppeteer.Browser | null = null;
  private page: Puppeteer.Page | null = null;
  private isInitialized: boolean = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.browser = await Puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--start-maximized',
          '--window-size=1920,1080',
          '--disable-blink-features=AutomationControlled'
        ],
        defaultViewport: null,
        slowMo: 50 + Math.random() * 100, // Randomized slowMo
      });

      await this.hideAutomation();
      await this.resetPage();
      this.isInitialized = true;
      console.log('Puppeteer initialized successfully');
    } catch (error) {
      console.error('Puppeteer init failed:', error);
      await this.close();
      throw error;
    }
  }

  private async hideAutomation() {
    if (!this.page) return;
    
    // Stealth plugins to avoid detection
    await this.page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async waitForSelectorWithRetry(selector: string, timeout: number, retries: number): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.page!.waitForSelector(selector, { timeout, visible: true });
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.delay(3000 + Math.random() * 2000); // Randomized delay
        await this.page!.reload();
      }
    }
  }

  private async resetPage(retries = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (this.page && !this.page.isClosed()) {
          await this.page.close().catch(() => {});
        }

        this.page = await this.browser!.newPage();
        await this.page.setDefaultNavigationTimeout(60000);
        
        // Set realistic headers and viewport
        await this.page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        });
        
        await this.page.setViewport({
          width: 1920 - Math.floor(Math.random() * 200),
          height: 1080 - Math.floor(Math.random() * 200),
          deviceScaleFactor: 1
        });

        // Randomize navigation timing
        await this.delay(1000 + Math.random() * 2000);
        await this.page.goto('https://www.fragrantica.com/perfume-finder', {
          waitUntil: 'domcontentloaded',
          timeout: 60000,
          referer: 'https://www.google.com/'
        });

        await this.waitForSelectorWithRetry('#autocomplete-0-input', 5000, 3);
        return;
      } catch (error) {
        console.error(`Reset attempt ${attempt} failed:`, error);
        if (attempt === retries) throw new Error(`Page reset failed after ${retries} attempts`);
        await this.delay(5000 * attempt);
      }
    }
  }

  private async ensureReady() {
    if (!this.isInitialized) {
      throw new Error('Scraper not initialized');
    }
    if (!this.page || this.page.isClosed()) {
      await this.resetPage();
    }
  }

  async searchFragrances(query: string): Promise<Fragrance[]> {
    await this.ensureReady();

    try {
      // Simulate human typing with random delays
      await this.page!.click('#autocomplete-0-input', { clickCount: 3 });
      await this.delay(200 + Math.random() * 300);
      await this.page!.keyboard.press('Backspace');
      await this.delay(300 + Math.random() * 400);

      // Type with variable speed
      for (const char of query) {
        await this.page!.keyboard.type(char, { delay: 80 + Math.random() * 120 });
      }

      await this.waitForSelectorWithRetry('.aa-Item', 10000, 3);

      return await this.page!.evaluate((): Fragrance[] => {
        const items = Array.from(document.querySelectorAll('.aa-Item'));
        return items.map(item => {
          const titleParts = item.querySelector('.aa-ItemContentTitle')?.textContent?.split(' - ') || [];
          return {
            id: item.id,
            title: titleParts[0]?.trim() || '',
            image: item.querySelector('.aa-ItemIcon')?.getAttribute('src') || '',
            brand: titleParts[0]?.split(' ').slice(0, -1).join(' ') || '',
            year: titleParts[1]?.trim(),
            gender: titleParts[2]?.trim(),
          };
        });
      });
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  async selectFragrance(itemId: string): Promise<string> {
    await this.ensureReady();
    if (!this.page) throw new Error('Page not ready');

    try {
      // 1. Human-like random delay
      await this.delay(1500 + Math.random() * 3000);

      // 2. Get element position for human-like movement
      const { x, y, width, height } = await this.page.evaluate((id) => {
        const el = document.getElementById(id);
        if (!el) return { x: 0, y: 0, width: 0, height: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        };
      }, itemId);

      // 3. Simulate human mouse movement
      await this.moveMouseHumanly(x, y, width, height);

      // 4. Natural click with position variation
      await this.page.mouse.click(
        x + width * (0.3 + Math.random() * 0.4),
        y + height * (0.3 + Math.random() * 0.4),
        { delay: 50 + Math.random() * 100 }
      );

      // 5. Wait with natural timing
      await this.delay(800 + Math.random() * 1500);

      // 6. Extract URL
      const url = await this.page.evaluate(() => {
        const link = document.querySelector('.grid-x.grid-margin-x.grid-margin-y .cell a[target="_blank"]');
        return link?.getAttribute('href');
      });

      if (!url) throw new Error('URL not found');

      // 7. Create fresh browser context for navigation
      const newBrowser = await Puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--start-maximized',
          '--window-size=1920,1080'
        ]
      });

      const newPage = await newBrowser.newPage();
      
      // Configure with realistic settings
      await newPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await newPage.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
      });

      // Navigate directly
      await newPage.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
        referer: 'https://www.google.com/'
      });

      // Close old instance
      await this.close();
      
      // Update references
      this.browser = newBrowser;
      this.page = newPage;
      this.isInitialized = true;

      return url;
    } catch (error) {
      console.error('Selection failed:', error);
      await this.resetPage();
      throw error;
    }
  }

  private async moveMouseHumanly(targetX: number, targetY: number, width: number, height: number) {
    if (!this.page) return;
    
    // Start from random position
    const startX = targetX - width * (1 + Math.random());
    const startY = targetY - height * (1 + Math.random());
    await this.page.mouse.move(startX, startY);
    
    // Move in curve with intermediate points
    const steps = 5 + Math.floor(Math.random() * 5);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const curveFactor = Math.sin(t * Math.PI) * 0.5;
      const x = startX + (targetX - startX) * t + (Math.random() * 20 - 10) + curveFactor * 50;
      const y = startY + (targetY - startY) * t + (Math.random() * 20 - 10);
      await this.page.mouse.move(x, y, { steps: 1 });
      await this.delay(50 + Math.random() * 100);
    }
  }

  async close() {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.close().catch(() => {});
      }
      if (this.browser) {
        await this.browser.close().catch(() => {});
      }
    } finally {
      this.isInitialized = false;
      this.page = null;
      this.browser = null;
    }
  }
}

export const scraperService = new ScraperService();