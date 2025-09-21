import { useState, useEffect, useCallback } from 'react';
import curatedImageService from '../services/CuratedImageService';

// Custom hook for managing curated images
export const useCuratedImages = () => {
    const [curatedImages, setCuratedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load curated images
    const loadCuratedImages = useCallback(() => {
        try {
            setLoading(true);
            const images = curatedImageService.getCuratedImages();
            setCuratedImages(images);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error loading curated images:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Add image to curated collection
    const addToCurated = useCallback(async (imageData) => {
        try {
            setLoading(true);
            const newImage = curatedImageService.addToCurated(imageData);
            loadCuratedImages(); // Refresh the list
            setError(null);
            return newImage;
        } catch (err) {
            setError(err.message);
            console.error('Error adding to curated:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadCuratedImages]);

    // Remove image from curated collection
    const removeFromCurated = useCallback(async (imageId) => {
        try {
            setLoading(true);
            await curatedImageService.removeFromCurated(imageId);
            loadCuratedImages(); // Refresh the list
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error removing from curated:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadCuratedImages]);

    // Clear all curated images
    const clearAllCurated = useCallback(async () => {
        try {
            setLoading(true);
            await curatedImageService.clearAllCurated();
            setCuratedImages([]);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error clearing curated:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check if an image is curated
    const isImageCurated = useCallback((imageUrl) => {
        return curatedImageService.isImageCurated(imageUrl);
    }, []);

    // Get random curated image
    const getRandomCuratedImage = useCallback(() => {
        return curatedImageService.getRandomCuratedImage();
    }, []);

    // Search curated images
    const searchCuratedImages = useCallback((searchTerm) => {
        return curatedImageService.searchCuratedImages(searchTerm);
    }, []);

    // Get curated images for specific news type
    const getCuratedImagesForNewsType = useCallback((newsType) => {
        return curatedImageService.getCuratedImagesForNewsType(newsType);
    }, []);

    // Get statistics
    const getStats = useCallback(() => {
        return curatedImageService.getStats();
    }, []);

    // Export curated images
    const exportCuratedImages = useCallback(() => {
        return curatedImageService.exportCuratedImages();
    }, []);

    // Import curated images
    const importCuratedImages = useCallback(async (jsonData, replaceExisting = false) => {
        try {
            setLoading(true);
            const result = curatedImageService.importCuratedImages(jsonData, replaceExisting);
            loadCuratedImages(); // Refresh the list
            setError(null);
            return result;
        } catch (err) {
            setError(err.message);
            console.error('Error importing curated images:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadCuratedImages]);

    // Load images on mount
    useEffect(() => {
        loadCuratedImages();
    }, [loadCuratedImages]);

    // Listen for storage changes (if curated images are modified in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'curatedImages') {
                loadCuratedImages();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [loadCuratedImages]);

    return {
        // State
        curatedImages,
        loading,
        error,

        // Actions
        addToCurated,
        removeFromCurated,
        clearAllCurated,
        loadCuratedImages,

        // Utilities
        isImageCurated,
        getRandomCuratedImage,
        searchCuratedImages,
        getCuratedImagesForNewsType,
        getStats,
        exportCuratedImages,
        importCuratedImages
    };
};

export default useCuratedImages;
