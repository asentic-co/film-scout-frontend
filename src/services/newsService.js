// News service to interact with GCP Cloud Functions
import fallbackNewsData from '../data/fallbackNewsData.js';
import newsImageClient from '../utils/newsImageClient.js';

class NewsService {
    constructor() {
        // Use dedicated environment variable for the News API URL
        this.baseURL = import.meta.env.VITE_NEWS_API_URL || 'http://localhost:3001';
        // This allows easy configuration across different environments (dev, staging, prod)
        this.enableImages = import.meta.env.VITE_ENABLE_NEWS_IMAGES !== 'false'; // Default to true unless explicitly disabled
        this.enableFallback = import.meta.env.VITE_ENABLE_NEWS_FALLBACK !== 'false';
    }

    async getProductionNews(limit = 5) {
        try {
            const response = await fetch(`${this.baseURL}/api/news/production?limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let newsItems = data.articles || [];

            // Enhance with images if enabled
            if (this.enableImages && newsItems.length > 0) {
                newsItems = await newsImageClient.enhanceNewsItems(newsItems);
            }

            return newsItems;

        } catch (error) {
            console.warn('Production news service unavailable, using fallback data:', error.message);
            return this.getFallbackNews('production', limit);
        }
    }

    async getLocationNews(limit = 5) {
        try {
            const response = await fetch(`${this.baseURL}/api/news/location?limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let newsItems = data.articles || [];

            // Enhance with images if enabled
            if (this.enableImages && newsItems.length > 0) {
                newsItems = await newsImageClient.enhanceNewsItems(newsItems);
            }

            return newsItems;

        } catch (error) {
            console.warn('Location news service unavailable, using fallback data:', error.message);
            return this.getFallbackNews('location', limit);
        }
    }

    async getGeneralNews(limit = 5) {
        try {
            const response = await fetch(`${this.baseURL}/api/news/general?limit=${limit}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let newsItems = data.articles || [];

            // Enhance with images if enabled
            if (this.enableImages && newsItems.length > 0) {
                newsItems = await newsImageClient.enhanceNewsItems(newsItems);
            }

            return newsItems;

        } catch (error) {
            console.warn('General news service unavailable, using fallback data:', error.message);
            return this.getFallbackNews('general', limit);
        }
    }

    getFallbackNews(type, limit = 5) {
        if (!this.enableFallback) {
            return [];
        }

        const fallbackItems = fallbackNewsData[type] || [];
        const limitedItems = fallbackItems.slice(0, limit);

        // Try to enhance fallback data with real images if enabled
        if (this.enableImages) {
            return newsImageClient.enhanceNewsItems(limitedItems).catch(() => {
                // If image enhancement fails, return fallback data as-is
                console.warn('Image enhancement failed for fallback data, using placeholder images');
                return limitedItems;
            });
        }

        return Promise.resolve(limitedItems);
    }

    // Method to check if we're currently using fallback data
    async getServiceStatus() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            return {
                available: response.ok,
                usingFallback: false
            };
        } catch (error) {
            return {
                available: false,
                usingFallback: this.enableFallback
            };
        }
    }
}

export default NewsService;
