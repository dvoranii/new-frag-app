import * as Puppeteer from 'puppeteer';
import { Fragrance } from '../types';

class ScraperService {
  private browser: Puppeteer.Browser | null = null;
  private page: Puppeteer.Page | null = null;
  private isInitialized: boolean = false;

  
  async initialize() {

    if (this.isInitialized) return;

    this.browser = await Puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
      slowMo: 50,
    });
    
    // this.page = await this.browser.newPage();
    // await this.page.goto('https://www.fragrantica.com/perfume-finder/');
    // await this.page.waitForSelector('#autocomplete-0-input');
    await this.resetPage();
    this.isInitialized = true;
  }

  private async resetPage() {
    try {
      if (this.page && !this.page.isClosed()) {
        await this.page.close();
      }

      this.page = await this.browser!.newPage();
      await this.page.goto('https://www.fragrantica.com/perfume-finder/');
      await this.page.waitForSelector('#autocomplete-0-input', { timeout: 10000 });
    
      this.page.setDefaultNavigationTimeout(60000);

    } catch (error) {
      console.error('Failed to reset page:', error);
      throw new Error('Page reset failed');
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
      // Clear previous search
      await this.page!.click('#autocomplete-0-input', { clickCount: 3 });
      await this.page!.keyboard.press('Backspace');

      // Type new query
      await this.page!.type('#autocomplete-0-input', query);

      // Wait for results
      await this.page!.waitForSelector('.aa-List', { visible: true, timeout: 10000 });

      // Extract results
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
            gender: titleParts[2]?.trim()
          };
        });
      });
    } catch (error) {
      console.error('Search failed, attempting reset...', error);
      await this.resetPage();
      throw error;
    }
  }

  async selectFragrance(itemId: string): Promise<string> {
    await this.ensureReady();

    try {
      await this.page!.click(`#${itemId}`);
      await this.page!.waitForSelector(
        '.grid-x.grid-margin-x.grid-margin-y .cell a[target="_blank"]', 
        { timeout: 10000 }
      );
      
      const url = await this.page!.evaluate(() => {
        const link = document.querySelector('.grid-x.grid-margin-x.grid-margin-y .cell a[target="_blank"]');
        return link?.getAttribute('href');
      });
      
      if (!url) throw new Error('Fragrance URL not found');
      return url;
    } catch (error) {
      console.error('Selection failed, attempting reset...', error);
      await this.resetPage();
      throw error;
    }
  }

  async close() {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
    this.isInitialized = false;
  }
}

export const scraperService = new ScraperService();