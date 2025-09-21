// Fallback Image Service for News Articles
// This service provides fallback images when AI generation is not available

class FallbackImageService {
    constructor() {
        this.baseUrl = '/assets';
    }

    /**
     * Get appropriate fallback image for a news item
     */
    getFallbackImageForNews(type, newsItem) {
        const images = this.getImagesByType(type);
        const selectedImage = this.selectBestImage(images, newsItem);

        return {
            url: selectedImage.url,
            altText: `${selectedImage.altText}: ${newsItem.title}`,
            isGenerated: false,
            isFallback: true,
            source: selectedImage.source || 'Stock Image'
        };
    }

    getImagesByType(type) {
        const imageCollections = {
            production: [
                {
                    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop&crop=center',
                    altText: 'Film production with professional cameras and crew',
                    keywords: ['camera', 'crew', 'filming', 'production', 'behind-scenes'],
                    source: 'Unsplash - Jakob Owens'
                },
                {
                    url: 'https://images.unsplash.com/photo-1489599849219-f06a7ad3bf8d?w=800&h=450&fit=crop&crop=center',
                    altText: 'Movie studio with lighting and equipment',
                    keywords: ['studio', 'lighting', 'equipment', 'professional', 'soundstage'],
                    source: 'Unsplash - Alex Litvin'
                },
                {
                    url: 'https://images.unsplash.com/photo-1596215143077-ca928c7ac421?w=800&h=450&fit=crop&crop=center',
                    altText: 'Behind the scenes film production',
                    keywords: ['behind-scenes', 'director', 'filming', 'cinema', 'movie'],
                    source: 'Unsplash - Denise Jans'
                },
                {
                    url: 'https://images.unsplash.com/photo-1518900673653-cf9fdd01e430?w=800&h=450&fit=crop&crop=center',
                    altText: 'Netflix and streaming content production',
                    keywords: ['streaming', 'netflix', 'digital', 'content', 'platform'],
                    source: 'Unsplash - Mollie Sivaram'
                },
                {
                    url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop&crop=center',
                    altText: 'AI and virtual production technology',
                    keywords: ['ai', 'virtual', 'technology', 'digital', 'innovation'],
                    source: 'Unsplash - Possessed Photography'
                }
            ],
            location: [
                {
                    url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=450&fit=crop&crop=center',
                    altText: 'New York City skyline filming location',
                    keywords: ['nyc', 'new-york', 'manhattan', 'skyline', 'urban'],
                    source: 'Unsplash - Luca Bravo'
                },
                {
                    url: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=450&fit=crop&crop=center',
                    altText: 'Urban filming location with architecture',
                    keywords: ['architecture', 'building', 'urban', 'filming', 'location'],
                    source: 'Unsplash - Leonel Fernandez'
                },
                {
                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&h=450&fit=crop&crop=center',
                    altText: 'Scenic outdoor filming location',
                    keywords: ['outdoor', 'scenic', 'landscape', 'filming', 'natural'],
                    source: 'Unsplash - Luca Bravo'
                },
                {
                    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=450&fit=crop&crop=center',
                    altText: 'High Line elevated park NYC',
                    keywords: ['high-line', 'elevated', 'park', 'nyc', 'unique'],
                    source: 'Unsplash - Luca Bravo'
                },
                {
                    url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800&h=450&fit=crop&crop=center',
                    altText: 'Brooklyn Bridge iconic filming location',
                    keywords: ['brooklyn', 'bridge', 'iconic', 'landmark', 'famous'],
                    source: 'Unsplash - Jermaine Ee'
                }
            ]
        };

        return imageCollections[type] || imageCollections.production;
    }

    selectBestImage(images, newsItem) {
        const searchText = `${newsItem.title} ${newsItem.summary}`.toLowerCase();

        // Score each image based on keyword matches
        const scoredImages = images.map(image => {
            let score = 0;
            image.keywords.forEach(keyword => {
                if (searchText.includes(keyword)) {
                    score += 1;
                }
            });

            return { ...image, score };
        });

        // Sort by score and return the best match, or random if no matches
        scoredImages.sort((a, b) => b.score - a.score);

        if (scoredImages[0].score > 0) {
            return scoredImages[0];
        }

        // Return random image if no keyword matches
        return images[Math.floor(Math.random() * images.length)];
    }

    /**
     * Generate smart image URLs with optimization parameters
     */
    optimizeImageUrl(baseUrl, options = {}) {
        const {
            width = 800,
            height = 450,
            quality = 80,
            format = 'webp'
        } = options;

        // For Unsplash URLs, add optimization parameters
        if (baseUrl.includes('unsplash.com')) {
            const separator = baseUrl.includes('?') ? '&' : '?';
            return `${baseUrl}${separator}w=${width}&h=${height}&q=${quality}&fm=${format}&fit=crop&crop=center`;
        }

        return baseUrl;
    }

    /**
     * Preload images for better performance
     */
    preloadImages(images) {
        images.forEach(image => {
            const img = new Image();
            img.src = image.url;
        });
    }
}

export default FallbackImageService;
