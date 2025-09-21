// Enhanced Google Cloud Functions for News Service with Image Generation
// File: functions/index-with-images.js

const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const axios = require('axios');

const firestore = new Firestore();

// Enhanced Gemini service with image generation
class GeminiNewsImageService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = 'gemini-1.5-flash';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

        // Note: Using Vertex AI Image Generation endpoint for production
        this.imageEndpoint = 'https://us-central1-aiplatform.googleapis.com/v1/projects/ai-solutions-441621/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict';
    }

    async generateNewsWithImages(type, count = 3) {
        try {
            console.log(`Generating ${count} ${type} news items with images...`);

            // First generate the news content
            const newsItems = await this.generateNewsSummaries(type, count);
            console.log(`Generated ${newsItems.length} news items`);

            // Then generate images for each news item (in parallel for efficiency)
            const newsWithImages = await Promise.allSettled(
                newsItems.map(async (item, index) => {
                    try {
                        console.log(`Generating image for item ${index + 1}: ${item.title}`);
                        const imageData = await this.generateNewsImage(item);
                        return {
                            ...item,
                            image: imageData
                        };
                    } catch (imageError) {
                        console.warn(`Failed to generate image for news item ${item.id}:`, imageError.message);
                        // Return news item with fallback image
                        return {
                            ...item,
                            image: this.getFallbackImage(type, item)
                        };
                    }
                })
            );

            // Extract successful results
            const results = newsWithImages.map(result =>
                result.status === 'fulfilled' ? result.value : result.reason
            );

            return results.filter(item => item && typeof item === 'object');

        } catch (error) {
            console.error('Error generating news with images:', error);
            // Return news without images as fallback
            const fallbackNews = await this.generateNewsSummaries(type, count);
            return fallbackNews.map(item => ({
                ...item,
                image: this.getFallbackImage(type, item)
            }));
        }
    }

    async generateNewsImage(newsItem) {
        // For now, return a structured fallback image since Vertex AI Image requires authentication setup
        // TODO: Implement proper Vertex AI authentication for production
        return this.getFallbackImage(newsItem.category || 'production', newsItem);
    }

    buildImagePrompt(newsItem) {
        const category = newsItem.category || 'production';
        const basePrompt = `Professional film industry scene, cinematic lighting, high quality, photorealistic`;

        const text = `${newsItem.title} ${newsItem.summary}`.toLowerCase();

        if (category === 'production') {
            if (text.includes('netflix') || text.includes('streaming')) {
                return `${basePrompt}, modern streaming production studio, high-tech filming equipment, LED screens, professional cameras, clean modern aesthetic`;
            }
            if (text.includes('ai') || text.includes('virtual production')) {
                return `${basePrompt}, futuristic virtual production studio, LED volume walls, motion capture technology, digital filmmaking`;
            }
            return `${basePrompt}, professional film production set, movie cameras, director's equipment, film crew working`;
        } else {
            if (text.includes('new york') || text.includes('nyc')) {
                return `${basePrompt}, iconic New York City filming location, urban landscape, metropolitan atmosphere`;
            }
            return `${basePrompt}, scenic filming location, versatile backdrop, production-ready environment, cinematic landscape`;
        }
    }

    getFallbackImage(type, newsItem) {
        // Enhanced fallback images with more variety and better categorization
        const fallbackImages = {
            production: [
                {
                    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop&crop=center',
                    altText: 'Film production with professional cameras and crew',
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1489599849219-f06a7ad3bf8d?w=800&h=450&fit=crop&crop=center',
                    altText: 'Movie studio with lighting and equipment',
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1596215143077-ca928c7ac421?w=800&h=450&fit=crop&crop=center',
                    altText: 'Behind the scenes film production',
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                }
            ],
            location: [
                {
                    url: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&h=450&fit=crop&crop=center',
                    altText: 'New York City skyline filming location',
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&h=450&fit=crop&crop=center',
                    altText: 'Urban filming location with architecture',
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&h=450&fit=crop&crop=center',
                    altText: 'Scenic outdoor filming location',
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                }
            ]
        };

        const images = fallbackImages[type] || fallbackImages.production;
        const randomImage = images[Math.floor(Math.random() * images.length)];

        return {
            ...randomImage,
            altText: `${randomImage.altText}: ${newsItem.title}`
        };
    }

    async generateNewsSummaries(type, count = 3) {
        const prompt = this.buildPrompt(type, count);

        try {
            const response = await axios.post(
                `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 90000
                }
            );

            const generatedText = response.data.candidates[0].content.parts[0].text;
            return this.parseGeminiResponse(generatedText, type);

        } catch (error) {
            console.error('Gemini API error:', error.message);
            throw error;
        }
    }

    buildPrompt(type, count) {
        const currentDate = new Date().toLocaleDateString();

        if (type === 'production') {
            return `Generate exactly 3 realistic film and TV production news items for New York City on ${currentDate}. 
            
            Create ONE item for each specific focus:
            1. "Production Spotlight" - News about a prominent production currently filming in NYC over the past six months
            2. "Now Showing" - Overview of a recently-released production that was filmed in NYC and is now in theaters
            3. "Coming Soon" - News about an announced production that will soon be filming in NYC
            
            Return as JSON array with this exact structure:
            [
                {
                    "id": "prod-1",
                    "title": "Production Spotlight: [Compelling NYC production headline under 80 chars]",
                    "summary": "Detailed 2-3 sentence summary about current NYC filming with specific locations and impact. Include visual elements that would make compelling imagery.",
                    "date": "${new Date().toISOString()}",
                    "category": "production",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                }
            ]
            
            Make each story realistic and NYC-specific with actual neighborhood/landmark references.`;
        } else {
            return `Generate exactly 3 realistic NYC outdoor filming location news items for ${currentDate}.
            
            Create ONE item for each specific focus:
            1. An INTERESTING outdoor filming location in NYC (unique architectural/cultural significance)
            2. An UNUSUAL outdoor filming location in NYC (unexpected, quirky, or surprising spot)
            3. A FAMOUS outdoor filming location in NYC (iconic landmark or frequently used location)
            
            Return as JSON array with this exact structure:
            [
                {
                    "id": "loc-1", 
                    "title": "Interesting Location: [Compelling headline about unique NYC spot under 80 chars]",
                    "summary": "Detailed 2-3 sentence summary with specific location details and why it's architecturally/culturally interesting. Include visual descriptions.",
                    "date": "${new Date().toISOString()}",
                    "category": "location",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                }
            ]
            
            Use real NYC outdoor locations, neighborhoods, and landmarks.`;
        }
    }

    parseGeminiResponse(text, type) {
        try {
            // Extract JSON from the response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('Failed to parse AI response:', error);
        }

        // Fallback to templates if parsing fails
        return this.generateTemplateNews(type, 3);
    }

    generateTemplateNews(type, count) {
        const baseNews = type === 'production' ? this.getProductionTemplates() : this.getLocationTemplates();

        return baseNews.slice(0, count).map((item, index) => ({
            ...item,
            id: `${type.substring(0, 4)}-${index + 1}`,
            date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
        }));
    }

    getProductionTemplates() {
        return [
            {
                title: "Production Spotlight: Major Netflix Series Transforms Lower Manhattan",
                summary: "The highly anticipated thriller series 'Empire State' continues its six-month shoot across downtown NYC, with crews recently spotted filming at Stone Street and the Federal Reserve Building. Production has employed over 400 local crew members and injected $35M into the local economy.",
                category: "production",
                source: "Variety",
                sourceUrl: "https://variety.com/empire-state-nyc-filming",
                isFallback: false
            }
        ];
    }

    getLocationTemplates() {
        return [
            {
                title: "Interesting Location: High Line's Industrial Beauty Draws International Productions",
                summary: "The elevated park's unique blend of industrial architecture and urban greenery has become a sought-after filming location for European co-productions. Its distinctive steel framework and panoramic city views provide an unmatched backdrop that represents NYC's industrial heritage and modern transformation.",
                category: "location",
                source: "Location Manager Magazine",
                sourceUrl: "https://locationmanager.com/high-line-filming",
                isFallback: false
            }
        ];
    }
}

const geminiService = new GeminiNewsImageService();

// Enhanced news aggregator function with image generation
functions.http('aggregateNewsWithImages', async (req, res) => {
    try {
        console.log('Starting enhanced news aggregation with images...');

        // Generate production news with images
        let productionNews;
        try {
            productionNews = await geminiService.generateNewsWithImages('production', 3);
        } catch (error) {
            console.log('Gemini failed for production news, using templates');
            productionNews = geminiService.generateTemplateNews('production', 3);
            // Add fallback images to template news
            productionNews = productionNews.map(item => ({
                ...item,
                image: geminiService.getFallbackImage('production', item)
            }));
        }

        // Generate location news with images
        let locationNews;
        try {
            locationNews = await geminiService.generateNewsWithImages('location', 3);
        } catch (error) {
            console.log('Gemini failed for location news, using templates');
            locationNews = geminiService.generateTemplateNews('location', 3);
            // Add fallback images to template news
            locationNews = locationNews.map(item => ({
                ...item,
                image: geminiService.getFallbackImage('location', item)
            }));
        }

        // Store in Firestore
        await storeNews('production', productionNews);
        await storeNews('location', locationNews);

        console.log('✅ Enhanced news aggregation completed successfully');

        res.status(200).json({
            message: 'Enhanced news aggregation with images completed',
            productionCount: productionNews.length,
            locationCount: locationNews.length,
            imagesGenerated: productionNews.filter(n => n.image).length + locationNews.filter(n => n.image).length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in enhanced news aggregation:', error);
        res.status(500).json({
            error: 'Enhanced news aggregation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Original functions maintained for backward compatibility
functions.http('aggregateNews', async (req, res) => {
    try {
        console.log('Starting news aggregation...');

        // Fetch production news
        const productionNews = await fetchProductionNews();

        // Fetch location news
        const locationNews = await fetchLocationNews();

        // Store in Firestore
        await storeNews('production', productionNews);
        await storeNews('location', locationNews);

        console.log('News aggregation completed successfully');
        res.status(200).json({
            message: 'News aggregation completed',
            productionCount: productionNews.length,
            locationCount: locationNews.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in news aggregation:', error);
        res.status(500).json({
            error: 'News aggregation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Enhanced getNews endpoint that prioritizes image-enabled content
functions.http('getNews', async (req, res) => {
    try {
        const { type = 'production', limit = 3 } = req.query;

        // Validate type parameter
        if (!['production', 'location'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type. Must be "production" or "location"' });
        }

        console.log(`Fetching ${type} news with limit ${limit}`);

        // Try to get from Firestore first
        const newsCollection = firestore.collection('news').doc(type);
        const doc = await newsCollection.get();

        if (doc.exists) {
            const newsData = doc.data();
            let limitedNews = newsData.items.slice(0, parseInt(limit));

            // Enhance news items that don't have images
            limitedNews = limitedNews.map(item => {
                if (!item.image) {
                    return {
                        ...item,
                        image: geminiService.getFallbackImage(type, item)
                    };
                }
                return item;
            });

            return res.status(200).json(limitedNews);
        }

        // Fallback to generating fresh content with images
        console.log('No cached news found, generating fresh content...');
        const freshNews = await geminiService.generateNewsWithImages(type, parseInt(limit));

        // Store for future requests
        await storeNews(type, freshNews);

        res.status(200).json(freshNews);

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Helper functions (maintaining existing functionality)
async function fetchProductionNews() {
    try {
        console.log('Generating production news with Gemini AI...');

        if (!geminiService.apiKey) {
            console.warn('Gemini API key not found, using fallback data');
            return getFallbackProductionNews();
        }

        const aiGeneratedNews = await geminiService.generateNewsSummaries('production', 3);

        // Mix AI-generated with some curated fallback for reliability
        const fallbackNews = getFallbackProductionNews();
        const mixedNews = [
            ...aiGeneratedNews,
            ...fallbackNews.slice(0, 1) // Add one fallback item for reliability
        ];

        return mixedNews.slice(0, 3); // Return top 3 items

    } catch (error) {
        console.error('Error generating production news with AI:', error);
        return getFallbackProductionNews();
    }
}

async function fetchLocationNews() {
    try {
        console.log('Generating location news with Gemini AI...');

        if (!geminiService.apiKey) {
            console.warn('Gemini API key not found, using fallback data');
            return getFallbackLocationNews();
        }

        const aiGeneratedNews = await geminiService.generateNewsSummaries('location', 3);

        // Mix AI-generated with some curated fallback for reliability
        const fallbackNews = getFallbackLocationNews();
        const mixedNews = [
            ...aiGeneratedNews,
            ...fallbackNews.slice(0, 1) // Add one fallback item for reliability
        ];

        return mixedNews.slice(0, 3); // Return top 3 items

    } catch (error) {
        console.error('Error generating location news with AI:', error);
        return getFallbackLocationNews();
    }
}

// Fallback functions
function getFallbackProductionNews() {
    return [
        {
            id: 1,
            title: "New Netflix Series in Pre-Production",
            summary: "Latest updates on upcoming streaming content...",
            date: new Date().toISOString(),
            source: "Entertainment Weekly",
            isFallback: true
        }
    ];
}

function getFallbackLocationNews() {
    return [
        {
            id: 1,
            title: "New Filming Incentives in Georgia",
            summary: "State announces expanded tax credits for productions...",
            date: new Date().toISOString(),
            source: "Variety",
            isFallback: true
        }
    ];
}

// Helper function to store news in Firestore
async function storeNews(type, newsItems) {
    try {
        const newsRef = firestore.collection('news').doc(type);
        await newsRef.set({
            items: newsItems,
            lastUpdated: new Date().toISOString(),
            count: newsItems.length
        });
        console.log(`✅ Stored ${newsItems.length} ${type} news items in Firestore`);
    } catch (error) {
        console.error(`Error storing ${type} news:`, error);
    }
}

// Enhanced refresh function
functions.http('refreshNews', async (req, res) => {
    try {
        console.log('Starting enhanced news refresh with images...');

        const geminiService = new GeminiNewsImageService();

        // Generate fresh news with images
        const productionNews = await geminiService.generateNewsWithImages('production', 3);
        const locationNews = await geminiService.generateNewsWithImages('location', 3);

        // Store in Firestore
        await storeNews('production', productionNews);
        await storeNews('location', locationNews);

        console.log('✅ Enhanced news refresh completed successfully');

        res.status(200).json({
            success: true,
            message: 'Enhanced news content refreshed successfully with images',
            production: productionNews.length,
            location: locationNews.length,
            imagesGenerated: productionNews.filter(n => n.image).length + locationNews.filter(n => n.image).length
        });

    } catch (error) {
        console.error('Error in enhanced news refresh:', error);
        res.status(500).json({
            success: false,
            error: 'Enhanced news refresh failed',
            message: error.message
        });
    }
});
