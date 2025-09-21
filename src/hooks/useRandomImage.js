// Hook for getting random Unsplash images for news cards
import { useState, useEffect } from 'react';
import { getSeededRandomImage, getRandomImages } from '../services/UnsplashImageService';

export const useRandomImage = (type, cardId, refreshTrigger = 0) => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImage = async () => {
            setLoading(true);

            try {
                // Use card ID as seed for consistent images until refresh
                const seed = cardId ? cardId.split('').reduce((a, b) => {
                    a = ((a << 5) - a) + b.charCodeAt(0);
                    return a & a;
                }, 0) + refreshTrigger : Math.random() * 1000;

                const selectedImage = await getSeededRandomImage(Math.abs(seed), type);

                if (selectedImage) {
                    setImage(selectedImage);
                }
            } catch (error) {
                console.error('Error getting random image:', error);
            } finally {
                setLoading(false);
            }
        };

        loadImage();
    }, [type, cardId, refreshTrigger]);

    return { image, loading };
};

// Hook for getting multiple random images
export const useRandomImages = (count, type, excludeUsed = true) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImages = async () => {
            setLoading(true);

            try {
                const selectedImages = await getRandomImages(count, type, excludeUsed);
                setImages(selectedImages);
            } catch (error) {
                console.error('Error getting random images:', error);
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [count, type, excludeUsed]);

    const refreshImages = async () => {
        const selectedImages = await getRandomImages(count, type, excludeUsed);
        setImages(selectedImages);
    };

    return { images, loading, refreshImages };
};
