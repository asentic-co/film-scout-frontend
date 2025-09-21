// src/utils/curatedNewsImageClient.js

/**
 * Client for fetching a random curated news image from the backend
 */
class CuratedNewsImageClient {
    constructor() {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.baseUrl = 'http://localhost:4000/curated-news-image';
        } else if (hostname.endsWith('filmscout.app')) {
            this.baseUrl = 'https://api.filmscout.app/curated-news-image';
        } else {
            this.baseUrl = import.meta.env.VITE_CURATED_NEWS_IMAGE_API || 'https://api.filmscout.app/curated-news-image';
        }
    }

    /**
     * Fetch a random curated news image
     * @returns {Promise<Object>} Image data including url and alt text
     */
    async fetchRandomCuratedImage() {
        try {
            const response = await fetch(this.baseUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch curated news image: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching curated news image:', error);
            return {
                url: null,
                alt: 'No curated image available',
                error: error.message
            };
        }
    }

    /**
     * Fetch multiple unique curated news images
     * @param {number} count - Number of unique images to fetch
     * @param {number} maxAttempts - Maximum attempts to avoid infinite loops
     * @returns {Promise<Array>} Array of unique image data objects
     */
    async fetchUniqueRandomCuratedImages(count = 6, maxAttempts = 20) {
        const uniqueImages = [];
        const usedUrls = new Set();
        const usedIds = new Set();
        let attempts = 0;

        while (uniqueImages.length < count && attempts < maxAttempts) {
            try {
                const image = await this.fetchRandomCuratedImage();

                // Check if we got a valid image and it's not a duplicate
                if (image && image.url && !image.error) {
                    const imageKey = image.id || image.url; // Use ID if available, otherwise URL

                    if (!usedIds.has(imageKey) && !usedUrls.has(image.url)) {
                        usedIds.add(imageKey);
                        usedUrls.add(image.url);
                        uniqueImages.push(image);
                    }
                }

                attempts++;

                // Add a small delay between requests to avoid overwhelming the server
                if (uniqueImages.length < count && attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

            } catch (error) {
                console.error('Error fetching unique curated images:', error);
                attempts++;
            }
        }

        // If we couldn't get enough unique images, fill with error placeholders
        while (uniqueImages.length < count) {
            uniqueImages.push({
                url: null,
                alt: 'No curated image available',
                error: 'Insufficient unique images available'
            });
        }

        console.log(`Fetched ${uniqueImages.filter(img => !img.error).length} unique images out of ${count} requested`);
        return uniqueImages;
    }
}

// Export singleton instance
const curatedNewsImageClient = new CuratedNewsImageClient();
export default curatedNewsImageClient;
