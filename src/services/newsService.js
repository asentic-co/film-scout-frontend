// News service to interact with GCP Cloud Functions
import newsImageClient from '../utils/newsImageClient.js';

class NewsService {
    constructor() {
        // Use dedicated environment variable for the News API URL
        this.baseUrl = import.meta.env.VITE_NEWS_API_URL || 'https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews';
        // This allows easy configuration across different environments (dev, staging, prod)
        this.enableImages = import.meta.env.VITE_ENABLE_NEWS_IMAGES !== 'false'; // Default to true unless explicitly disabled
    }

    async getProductionNews(limit = 3) {
        try {
            const response = await fetch(`${this.baseUrl}?type=production&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch production news');
            const newsData = await response.json();

            // Enhance with images if enabled
            if (this.enableImages) {
                return await newsImageClient.enhanceNewsItemsWithImages(
                    newsData.map(item => ({ ...item, type: 'production' }))
                );
            }

            return newsData;
        } catch (error) {
            console.error('Error fetching production news:', error);
            const fallbackData = this.getFallbackProductionNews();

            // Still try to add images to fallback data if enabled
            if (this.enableImages) {
                return await newsImageClient.enhanceNewsItemsWithImages(
                    fallbackData.map(item => ({ ...item, type: 'production', isFallback: true }))
                );
            }

            return fallbackData;
        }
    }

    async getLocationNews(limit = 3) {
        try {
            const response = await fetch(`${this.baseUrl}?type=location&limit=${limit}`);
            if (!response.ok) throw new Error('Failed to fetch location news');
            const newsData = await response.json();

            // Enhance with images if enabled
            if (this.enableImages) {
                return await newsImageClient.enhanceNewsItemsWithImages(
                    newsData.map(item => ({ ...item, type: 'location' }))
                );
            }

            return newsData;
        } catch (error) {
            console.error('Error fetching location news:', error);
            const fallbackData = this.getFallbackLocationNews();

            // Still try to add images to fallback data if enabled
            if (this.enableImages) {
                return await newsImageClient.enhanceNewsItemsWithImages(
                    fallbackData.map(item => ({ ...item, type: 'location', isFallback: true }))
                );
            }

            return fallbackData;
        }
    }

    // Fallback data for when API is unavailable
    getFallbackProductionNews() {
        return [
            {
                id: 1,
                title: "Netflix Series Behind the Scenes",
                summary: "Exclusive look at the production process of upcoming streaming content in New York City studios...",
                date: new Date().toISOString(),
                source: "Industry Insider",
                type: 'production',
                isFallback: true
            },
            {
                id: 2,
                title: "Independent Film Festival Production",
                summary: "Behind the camera view of exciting new projects from emerging filmmakers shooting in Brooklyn...",
                date: new Date().toISOString(),
                source: "Film Weekly",
                type: 'production',
                isFallback: true
            },
            {
                id: 3,
                title: "Major Studio Partnership Announcement",
                summary: "Production companies reveal new collaboration deals for filming in NYC locations this year...",
                date: new Date().toISOString(),
                source: "Studio Report",
                type: 'production',
                isFallback: true
            }
        ];
    }

    getFallbackLocationNews() {
        return [
            {
                id: 1,
                title: "Brooklyn Bridge Filming Permits",
                summary: "New filming guidelines and increased accessibility for production crews shooting at iconic NYC landmarks...",
                date: new Date().toISOString(),
                source: "NYC Film Office",
                type: 'location',
                isFallback: true
            },
            {
                id: 2,
                title: "Central Park Location Scouting",
                summary: "Popular filming spots in Central Park see increased demand as streaming series expand NYC shoots...",
                date: new Date().toISOString(),
                source: "Location Scout",
                type: 'location',
                isFallback: true
            },
            {
                id: 3,
                title: "Manhattan Rooftop Filming Trends",
                summary: "High-rise filming locations becoming more popular with action sequences and dramatic city backdrop shots...",
                date: new Date().toISOString(),
                source: "Location Manager",
                type: 'location',
                isFallback: true
            }
        ];
    }
}

export default new NewsService();
