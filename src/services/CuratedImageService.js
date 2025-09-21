// Service for managing curated images and integration with News components

class CuratedImageService {
    constructor() {
        this.storageKey = 'curatedImages';
    }

    // Get all curated images
    getCuratedImages() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading curated images:', error);
            return [];
        }
    }

    // Add an image to curated collection
    addToCurated(imageData) {
        const curatedItem = {
            id: Date.now() + Math.random(),
            url: imageData.url,
            title: imageData.title || 'Untitled',
            searchPhrase: imageData.searchPhrase || '',
            curatedAt: new Date().toISOString(),
            ...imageData
        };

        const existing = this.getCuratedImages();
        const updated = [...existing, curatedItem];

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(updated));
            return curatedItem;
        } catch (error) {
            console.error('Error saving curated image:', error);
            throw error;
        }
    }

    // Remove an image from curated collection
    removeFromCurated(imageId) {
        const existing = this.getCuratedImages();
        const updated = existing.filter(img => img.id !== imageId);

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(updated));
            return true;
        } catch (error) {
            console.error('Error removing curated image:', error);
            throw error;
        }
    }

    // Clear all curated images
    clearAllCurated() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing curated images:', error);
            throw error;
        }
    }

    // Check if an image URL is already curated
    isImageCurated(imageUrl) {
        const curated = this.getCuratedImages();
        return curated.some(img => img.url === imageUrl);
    }

    // Get a random curated image
    getRandomCuratedImage() {
        const curated = this.getCuratedImages();
        if (curated.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * curated.length);
        return curated[randomIndex];
    }

    // Get curated images by search phrase or keyword
    searchCuratedImages(searchTerm) {
        const curated = this.getCuratedImages();
        const term = searchTerm.toLowerCase();

        return curated.filter(img =>
            img.title.toLowerCase().includes(term) ||
            img.searchPhrase.toLowerCase().includes(term)
        );
    }

    // Get curated images suitable for a specific news type
    getCuratedImagesForNewsType(newsType) {
        const curated = this.getCuratedImages();
        const typeKeywords = {
            production: ['production', 'filming', 'movie', 'film', 'studio', 'set', 'crew'],
            location: ['location', 'neighborhood', 'street', 'building', 'area', 'district'],
            general: [] // All images are suitable for general news
        };

        if (newsType === 'general') {
            return curated;
        }

        const keywords = typeKeywords[newsType] || [];

        return curated.filter(img => {
            const searchText = `${img.title} ${img.searchPhrase}`.toLowerCase();
            return keywords.some(keyword => searchText.includes(keyword));
        });
    }

    // Get curated image statistics
    getStats() {
        const curated = this.getCuratedImages();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const week = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        return {
            total: curated.length,
            today: curated.filter(img => new Date(img.curatedAt) >= today).length,
            thisWeek: curated.filter(img => new Date(img.curatedAt) >= week).length,
            searchPhrases: [...new Set(curated.map(img => img.searchPhrase))].length
        };
    }

    // Export curated images as JSON
    exportCuratedImages() {
        const curated = this.getCuratedImages();
        const exportData = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            images: curated
        };

        return JSON.stringify(exportData, null, 2);
    }

    // Import curated images from JSON
    importCuratedImages(jsonData, replaceExisting = false) {
        try {
            const importData = JSON.parse(jsonData);

            if (!importData.images || !Array.isArray(importData.images)) {
                throw new Error('Invalid import data format');
            }

            let existing = replaceExisting ? [] : this.getCuratedImages();

            // Process imported images
            const imported = importData.images.map(img => ({
                ...img,
                id: img.id || Date.now() + Math.random(),
                curatedAt: img.curatedAt || new Date().toISOString()
            }));

            // Merge with existing, avoiding duplicates by URL
            const existingUrls = new Set(existing.map(img => img.url));
            const newImages = imported.filter(img => !existingUrls.has(img.url));

            const updated = [...existing, ...newImages];

            localStorage.setItem(this.storageKey, JSON.stringify(updated));

            return {
                imported: newImages.length,
                skipped: imported.length - newImages.length,
                total: updated.length
            };

        } catch (error) {
            console.error('Error importing curated images:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const curatedImageService = new CuratedImageService();
export default curatedImageService;
