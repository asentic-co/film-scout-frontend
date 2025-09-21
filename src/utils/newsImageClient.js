import { API_ENDPOINTS } from './apiConfig';

/**
 * Client for fetching images related to news articles using Google Images
 */
class NewsImageClient {
    constructor() {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.baseUrl = 'http://localhost:4000/news-images';
        } else if (hostname.endsWith('filmscout.app')) {
            this.baseUrl = 'https://api.filmscout.app/news-images';
        } else {
            this.baseUrl = API_ENDPOINTS.NEWS_IMAGES || 'https://api.filmscout.app/news-images';
        }
    }

    /**
     * Fetch an image for a news article
     * @param {string} searchTerm - The search term derived from news title/content
     * @param {string} newsType - 'production' or 'location' to enhance search context
     * @returns {Promise<Object>} Image data including URL, thumbnail, alt text, etc.
     */
    async fetchNewsImage(searchTerm, newsType = 'general') {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchTerm: searchTerm.trim(),
                    newsType
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch news image: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching news image:', error);

            // Return a fallback structure that matches the expected format
            return {
                primary: null,
                alternatives: [],
                error: error.message,
                fallback: {
                    url: null,
                    thumbnail: null,
                    altText: `No image available for: ${searchTerm}`,
                    isGenerated: false,
                    message: "Image search unavailable"
                }
            };
        }
    }

    /**
     * Extract meaningful search terms from a news article title
     * @param {string} title - The news article title
     * @param {string} summary - Optional summary for more context
     * @returns {string} Cleaned search term
     */
    extractSearchTerm(title, summary = '') {
        if (!title) return '';

        // Remove common news words that don't help with image search
        const stopWords = ['news', 'update', 'report', 'announces', 'breaking', 'latest'];
        const cleanTitle = title
            .toLowerCase()
            .split(' ')
            .filter(word => !stopWords.includes(word))
            .join(' ');

        // Take the first meaningful part if title is very long
        const words = cleanTitle.split(' ');
        if (words.length > 6) {
            return words.slice(0, 6).join(' ');
        }

        return cleanTitle || title;
    }

    /**
     * Enhance a news item with image data
     * @param {Object} newsItem - The news item to enhance
     * @returns {Promise<Object>} Enhanced news item with image property
     */
    async enhanceNewsItemWithImage(newsItem) {
        if (!newsItem || !newsItem.title) {
            return newsItem;
        }

        try {
            const searchTerm = this.extractSearchTerm(newsItem.title, newsItem.summary);
            const imageData = await this.fetchNewsImage(searchTerm, newsItem.type);

            // Add image data to news item
            const enhanced = {
                ...newsItem,
                image: imageData.primary || imageData.fallback || null,
                imageAlternatives: imageData.alternatives || [],
                imageSearchTerm: searchTerm,
                imageError: imageData.error || null
            };

            return enhanced;
        } catch (error) {
            console.error('Error enhancing news item with image:', error);
            return {
                ...newsItem,
                image: null,
                imageError: error.message
            };
        }
    }

    /**
     * Enhance multiple news items with images
     * @param {Array} newsItems - Array of news items
     * @param {number} maxConcurrent - Maximum concurrent image requests
     * @returns {Promise<Array>} Enhanced news items
     */
    async enhanceNewsItemsWithImages(newsItems, maxConcurrent = 3) {
        if (!Array.isArray(newsItems) || newsItems.length === 0) {
            return newsItems;
        }

        // Process in batches to avoid overwhelming the API
        const enhanced = [];
        for (let i = 0; i < newsItems.length; i += maxConcurrent) {
            const batch = newsItems.slice(i, i + maxConcurrent);
            const enhancedBatch = await Promise.all(
                batch.map(item => this.enhanceNewsItemWithImage(item))
            );
            enhanced.push(...enhancedBatch);
        }

        return enhanced;
    }
}

// Export singleton instance
export default new NewsImageClient();
