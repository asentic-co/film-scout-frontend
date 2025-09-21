// src/utils/imagePreloader.js

/**
 * Utility for preloading images to browser cache
 */
export const preloadImages = (imageUrls) => {
    return Promise.allSettled(
        imageUrls
            .filter(url => url && typeof url === 'string')
            .map(url => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        console.log(`[ImagePreloader] Successfully preloaded: ${url}`);
                        resolve(url);
                    };
                    img.onerror = (error) => {
                        console.warn(`[ImagePreloader] Failed to preload: ${url}`, error);
                        reject(error);
                    };
                    img.src = url;
                });
            })
    );
};

/**
 * Preload images from image objects with url property
 */
export const preloadImageObjects = (imageObjects) => {
    const urls = imageObjects
        .filter(img => img && img.url)
        .map(img => img.url);

    return preloadImages(urls);
};
