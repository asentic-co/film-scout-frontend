// Service for managing and selecting Unsplash images
import { fallbackImageData } from './fallbackImageData.js';

let images = [];
let usedImages = new Set();
let manifestLoaded = false;

// Load manifest data
export const loadManifest = async () => {
    if (manifestLoaded) return;

    try {
        const response = await fetch('/manifest.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const manifestData = await response.json();
        images = manifestData.images || [];
        manifestLoaded = true;
        console.log('Loaded manifest with', images.length, 'images');
    } catch (error) {
        console.warn('Failed to load image manifest, using fallback data:', error.message);
        // Use fallback data for Docker or other environments where manifest.json isn't available
        images = fallbackImageData.images || [];
        manifestLoaded = true;
        console.log('Using fallback data with', images.length, 'images');
    }
};

// Wait for manifest to load
export const ensureManifestLoaded = async () => {
    if (!manifestLoaded) {
        await loadManifest();
    }
};

// Get all images of a specific type
export const getImagesByType = (type) => {
    if (type === 'production') {
        return images.filter(img =>
            img.filename.startsWith('production-') ||
            img.category === 'production'
        );
    } else if (type === 'location') {
        return images.filter(img =>
            img.filename.startsWith('location-') ||
            img.category === 'location' ||
            img.category === 'nyc-locations'
        );
    }
    return images;
};

// Get a random image of a specific type
export const getRandomImage = async (type = null, excludeUsed = false) => {
    await ensureManifestLoaded();

    let availableImages = type ? getImagesByType(type) : images;

    if (excludeUsed && usedImages.size > 0) {
        availableImages = availableImages.filter(img => !usedImages.has(img.filename));

        // If all images have been used, reset the used set
        if (availableImages.length === 0) {
            usedImages.clear();
            availableImages = type ? getImagesByType(type) : images;
        }
    }

    if (availableImages.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];

    if (excludeUsed) {
        usedImages.add(selectedImage.filename);
    }

    return {
        url: selectedImage.originalUrl || `/images/${selectedImage.filename}`,
        altText: selectedImage.altText,
        source: selectedImage.source,
        filename: selectedImage.filename,
        tags: selectedImage.tags || [],
        isLocal: !selectedImage.originalUrl
    };
};

// Get multiple random images
export const getRandomImages = async (count, type = null, excludeUsed = false) => {
    await ensureManifestLoaded();

    const imageList = [];
    for (let i = 0; i < count; i++) {
        const image = await getRandomImage(type, excludeUsed);
        if (image) {
            imageList.push(image);
        }
    }
    return imageList;
};

// Get a seeded random image (consistent across refreshes with same seed)
export const getSeededRandomImage = async (seed, type = null) => {
    await ensureManifestLoaded();

    let availableImages = type ? getImagesByType(type) : images;

    if (availableImages.length === 0) {
        return null;
    }

    // Simple seeded random number generator
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const randomIndex = Math.floor(seededRandom(seed) * availableImages.length);
    const selectedImage = availableImages[randomIndex];

    return {
        url: selectedImage.originalUrl || `/images/${selectedImage.filename}`,
        altText: selectedImage.altText,
        source: selectedImage.source,
        filename: selectedImage.filename,
        tags: selectedImage.tags || [],
        isLocal: !selectedImage.originalUrl
    };
};

// Reset used images tracking
export const resetUsedImages = () => {
    usedImages.clear();
};

// Get stats about available images
export const getStats = () => {
    const productionCount = getImagesByType('production').length;
    const locationCount = getImagesByType('location').length;

    return {
        total: images.length,
        production: productionCount,
        location: locationCount,
        used: usedImages.size
    };
};
