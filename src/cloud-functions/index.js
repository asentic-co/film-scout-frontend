// Google Cloud Functions for News Service with Gemini AI
// File: functions/index.js

const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const axios = require('axios');

const firestore = new Firestore();

// Initialize Gemini service
class GeminiNewsService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = 'gemini-1.5-flash';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    async generateNewsWithImages(type, count = 3) {
        try {
            console.log(`Generating ${count} ${type} news items with images...`);

            // First generate the news content
            const newsItems = await this.generateNewsSummaries(type, count);
            console.log(`Generated ${newsItems.length} news items`);

            // Add images to each news item
            const newsWithImages = newsItems.map(item => ({
                ...item,
                image: this.getFallbackImage(type, item)
            }));

            return newsWithImages;

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

    getFallbackImage(type, newsItem) {
        // Enhanced dynamic image selection based on article content
        const searchText = `${newsItem.title} ${newsItem.summary}`.toLowerCase();

        // Enhanced fallback images with verified working URLs and unique images for each card
        const fallbackImages = {
            production: [
                {
                    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop&crop=center',
                    altText: 'Film production with professional cameras and crew',
                    keywords: ['cameras', 'filming', 'equipment', 'crew'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop&crop=center',
                    altText: 'Modern movie studio with lighting and technology',
                    keywords: ['studio', 'lighting', 'technology', 'modern'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=450&fit=crop&crop=center',
                    altText: 'Behind the scenes film production setup',
                    keywords: ['behind scenes', 'production', 'setup', 'film'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop&crop=center',
                    altText: 'Professional camera equipment for film production',
                    keywords: ['camera', 'professional', 'equipment', 'filmmaking'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=450&fit=crop&crop=center',
                    altText: 'Movie set with professional lighting and crew',
                    keywords: ['movie set', 'lighting', 'crew', 'film'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                }
            ],
            location: [
                {
                    url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=450&fit=crop&crop=center',
                    altText: 'New York City skyline filming location',
                    keywords: ['new york', 'nyc', 'skyline', 'cityscape'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&h=450&fit=crop&crop=center',
                    altText: 'Brooklyn Bridge iconic NYC filming spot',
                    keywords: ['brooklyn', 'bridge', 'iconic', 'landmark'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=450&fit=crop&crop=center',
                    altText: 'Central Park scenic outdoor filming location',
                    keywords: ['central park', 'outdoor', 'scenic', 'nature'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=450&fit=crop&crop=center',
                    altText: 'Times Square bustling filming location',
                    keywords: ['times square', 'busy', 'lights', 'crowd'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                },
                {
                    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=450&fit=crop&crop=center',
                    altText: 'Manhattan urban architecture filming spot',
                    keywords: ['manhattan', 'urban', 'architecture', 'modern'],
                    isGenerated: false,
                    isFallback: true,
                    source: 'Unsplash'
                }
            ]
        };

        const images = fallbackImages[type] || fallbackImages.production;

        // Smart image selection based on content keywords
        const selectedImage = this.selectBestImage(images, newsItem);

        return {
            ...selectedImage,
            altText: `${selectedImage.altText}: ${newsItem.title}`
        };
    }

    selectBestImage(images, newsItem) {
        const searchText = `${newsItem.title} ${newsItem.summary}`.toLowerCase();

        // Score images based on keyword matches
        const scoredImages = images.map(image => {
            let score = 0;

            // Check how many keywords match the search text
            if (image.keywords) {
                image.keywords.forEach(keyword => {
                    if (searchText.includes(keyword.toLowerCase())) {
                        score += 1;
                    }
                });
            }

            return { ...image, score };
        });

        // Sort by score and return the best match
        scoredImages.sort((a, b) => b.score - a.score);

        // If we have a good match (score > 0), use it
        if (scoredImages[0].score > 0) {
            return scoredImages[0];
        }

        // Otherwise, return a random image for variety
        return images[Math.floor(Math.random() * images.length)];
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
            1. News about a prominent production currently filming in NYC over the past six months
            2. Overview of a recently-released production that was filmed in NYC and is now in theaters
            3. News about an announced production that will soon be filming in NYC
            
            IMPORTANT: Keep titles clean and direct. Do NOT use prefixes like "Production Spotlight:", "Coming Soon:", "Latest Production:", etc.
            
            Return as JSON array with this exact structure:
            [
                {
                    "id": "prod-1",
                    "title": "[Compelling NYC production headline under 80 chars - NO PREFIXES]",
                    "summary": "Detailed 2-3 sentence summary about current NYC filming with specific locations and impact",
                    "date": "${new Date().toISOString()}",
                    "category": "production",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                },
                {
                    "id": "prod-2", 
                    "title": "[NYC-filmed production now in theaters under 80 chars - NO PREFIXES]",
                    "summary": "Detailed 2-3 sentence summary about recently released film/show filmed in NYC",
                    "date": "${new Date().toISOString()}",
                    "category": "production",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                },
                {
                    "id": "prod-3",
                    "title": "[Announced NYC production under 80 chars - NO PREFIXES]", 
                    "summary": "Detailed 2-3 sentence summary about upcoming NYC production with timeline and locations",
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
            
            IMPORTANT: Keep titles clean and direct. Do NOT use prefixes like "Interesting Location:", "Famous Location:", "Latest Location:", etc.
            
            Return as JSON array with this exact structure:
            [
                {
                    "id": "loc-1", 
                    "title": "[Compelling headline about unique NYC spot under 80 chars - NO PREFIXES]",
                    "summary": "Detailed 2-3 sentence summary with specific location details and why it's architecturally/culturally interesting",
                    "date": "${new Date().toISOString()}",
                    "category": "location",
                    "source": "Realistic trade publication name", 
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                },
                {
                    "id": "loc-2",
                    "title": "[Compelling headline about quirky NYC spot under 80 chars - NO PREFIXES]", 
                    "summary": "Detailed 2-3 sentence summary about unexpected or surprising filming location in NYC",
                    "date": "${new Date().toISOString()}",
                    "category": "location",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url", 
                    "isFallback": false
                },
                {
                    "id": "loc-3",
                    "title": "[Compelling headline about iconic NYC spot under 80 chars - NO PREFIXES]",
                    "summary": "Detailed 2-3 sentence summary about famous NYC landmark or frequently used filming location",
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

    /**
     * Clean up redundant words from article titles
     */
    cleanArticleTitle(title, type) {
        if (!title) return title;

        // Define redundant prefixes/patterns to remove
        const redundantPatterns = [
            // Generic patterns
            /^(Latest|Trending|Breaking|New|Update|News):\s*/i,
            /^(Latest|Trending|Breaking|New|Update)\s+(Production|Location)s?\s*(News|Update)?:?\s*/i,

            // Production-specific patterns
            /^(Production|Film|Movie|TV|Studio)\s+(News|Update|Spotlight|Alert):?\s*/i,
            /^(Latest|Trending|New)\s+(Film|Movie|Production)\s+(News|Update)?:?\s*/i,
            /^(Production\s+Spotlight|Now\s+Showing|Coming\s+Soon):?\s*/i,

            // Location-specific patterns
            /^(Location|Filming|Studio)\s+(News|Update|Spotlight|Alert):?\s*/i,
            /^(Latest|Trending|New)\s+(Location|Filming)\s+(News|Update)?:?\s*/i,
            /^(Interesting\s+Location|Unusual\s+Location|Famous\s+Location):?\s*/i,

            // Other common redundant starts
            /^(Industry|Hollywood|Entertainment)\s+(News|Update):?\s*/i,
            /^(Film|Movie|TV)\s+(Industry|News):?\s*/i
        ];

        let cleanedTitle = title.trim();

        // Remove redundant patterns
        for (const pattern of redundantPatterns) {
            cleanedTitle = cleanedTitle.replace(pattern, '');
        }

        // Clean up any double spaces and trim
        cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim();

        // Ensure title isn't empty after cleaning
        return cleanedTitle || title;
    }

    parseGeminiResponse(text, type) {
        try {
            // Extract JSON from the response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed)) {
                    // Clean up titles in the parsed response
                    return parsed.map(item => ({
                        ...item,
                        title: this.cleanArticleTitle(item.title, type)
                    }));
                }
                return [];
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
            },
            {
                title: "Now Showing: 'Brooklyn Nights' Showcases Borough's Film Renaissance",
                summary: "The indie drama featuring Prospect Park and Dumbo's cobblestone streets opens nationwide this weekend after a successful festival run. Director Sarah Chen's intimate portrayal of modern Brooklyn has earned critical acclaim and showcases the borough's cinematic potential.",
                category: "production",
                source: "The Hollywood Reporter",
                sourceUrl: "https://hollywoodreporter.com/brooklyn-nights-release",
                isFallback: false
            },
            {
                title: "Coming Soon: Marvel's Next Blockbuster Heads to Queens This Fall",
                summary: "Disney confirms that 'Spider-Man: Web of Shadows' will begin principal photography in Queens this October, with confirmed locations including Flushing Meadows and the Unisphere. Pre-production crews are already scouting additional borough locations for the highly anticipated sequel.",
                category: "production",
                source: "Entertainment Weekly",
                sourceUrl: "https://ew.com/spider-man-queens-filming",
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
            },
            {
                title: "Unusual Location: Roosevelt Island Tram Cars Become Mobile Film Studios",
                summary: "Productions are increasingly utilizing the Roosevelt Island Tramway's suspended cars for intimate dialogue scenes and dramatic aerial shots. The unique transportation method offers 360-degree views of Manhattan while providing a contained, controllable filming environment 250 feet above the East River.",
                category: "location",
                source: "NYC Film Office Quarterly",
                sourceUrl: "https://nycfilmoffice.com/roosevelt-tram-filming",
                isFallback: false
            },
            {
                title: "Famous Location: Washington Square Park Hosts Record Number of Productions",
                summary: "The iconic Greenwich Village landmark saw 47 film and TV shoots in the past year, making it NYC's most-filmed outdoor location. The park's distinctive arch and vibrant street performer culture continue to attract both major studio productions and independent filmmakers seeking authentic New York atmosphere.",
                category: "location",
                source: "Screen Daily",
                sourceUrl: "https://screendaily.com/washington-square-filming-record",
                isFallback: false
            }
        ];
    }

    generateFallbackUrl(title) {
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);

        const sources = ['variety.com', 'hollywoodreporter.com', 'deadline.com'];
        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        return `https://${randomSource}/${slug}`;
    }
}

const geminiService = new GeminiNewsService();

// News aggregator function - triggered monthly by Cloud Scheduler
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
        res.status(500).json({ error: 'Failed to aggregate news' });
    }
});

// Enhanced news aggregator function with image generation
functions.http('aggregateNewsWithImages', async (req, res) => {
    try {
        console.log('Starting enhanced news aggregation with images...');

        const geminiService = new GeminiNewsService();

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

// News API function - serves news to frontend
functions.http('getNews', async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    try {
        const { type, limit = 3 } = req.query;

        if (!type || !['production', 'location', 'latest'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type parameter. Must be production, location, or latest' });
        }

        // Handle 'latest' type by combining production and location news
        if (type === 'latest') {
            const productionRef = firestore.collection('news').doc('production');
            const locationRef = firestore.collection('news').doc('location');

            const [productionDoc, locationDoc] = await Promise.all([
                productionRef.get(),
                locationRef.get()
            ]);

            let allNews = [];

            if (productionDoc.exists) {
                const productionData = productionDoc.data();
                const productionNews = productionData.items.map(item => ({
                    ...item,
                    category: 'production'
                }));
                allNews.push(...productionNews);
            }

            if (locationDoc.exists) {
                const locationData = locationDoc.data();
                const locationNews = locationData.items.map(item => ({
                    ...item,
                    category: 'location'
                }));
                allNews.push(...locationNews);
            }

            // Shuffle and limit the combined news
            const shuffled = allNews.sort(() => Math.random() - 0.5);
            let limitedNews = shuffled.slice(0, parseInt(limit * 2)); // Get more items for latest

            // Enhance news items that don't have images
            const geminiService = new GeminiNewsService();
            limitedNews = limitedNews.map(item => {
                if (!item.image) {
                    return {
                        ...item,
                        image: geminiService.getFallbackImage(item.category || 'production', item)
                    };
                }
                return item;
            });

            res.status(200).json({ articles: limitedNews });
            return;
        }

        // Handle single type (production or location)
        const newsRef = firestore.collection('news').doc(type);
        const doc = await newsRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'No news found' });
        }

        const newsData = doc.data();
        let limitedNews = newsData.items.slice(0, parseInt(limit));

        // Enhance news items that don't have images
        const geminiService = new GeminiNewsService();
        limitedNews = limitedNews.map(item => {
            if (!item.image) {
                return {
                    ...item,
                    image: geminiService.getFallbackImage(type, item)
                };
            }
            return item;
        });

        res.status(200).json(limitedNews);

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Helper function to fetch production news using Gemini AI
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

// Helper function to fetch location news using Gemini AI
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

// Fallback production news (used when AI fails or as mix-in content)
function getFallbackProductionNews() {
    return [
        {
            id: `fallback_prod_${Date.now()}_1`,
            title: "AI-Powered Virtual Production Reaches New Milestone",
            summary: "Leading studios report 40% cost reduction using advanced LED wall technology and real-time rendering, revolutionizing how films are made with sustainable practices at the forefront...",
            date: new Date().toISOString(),
            category: "production",
            source: "The Hollywood Reporter",
            sourceUrl: "https://hollywoodreporter.com/ai-virtual-production-milestone",
            isFallback: true
        },
        {
            id: `fallback_prod_${Date.now()}_2`,
            title: "Streaming Giants Invest $2B in International Content",
            summary: "Major platforms announce unprecedented investment in local productions across 15 countries, focusing on diverse storytelling and emerging talent development programs...",
            date: new Date().toISOString(),
            category: "production",
            source: "Variety",
            sourceUrl: "https://variety.com/streaming-international-investment",
            isFallback: true
        },
        {
            id: `fallback_prod_${Date.now()}_3`,
            title: "Independent Film Tax Credits Boost NYC Production",
            summary: "New York State announces enhanced tax incentive program specifically for independent filmmakers, offering up to 45% credits for productions under $10M budget, sparking renaissance in local indie scene...",
            date: new Date().toISOString(),
            category: "production",
            source: "Film Independent",
            sourceUrl: "https://filmindependent.org/nyc-tax-credits-boost",
            isFallback: true
        }
    ];
}

// Fallback location news (used when AI fails or as mix-in content)  
function getFallbackLocationNews() {
    return [
        {
            id: `fallback_loc_${Date.now()}_1`,
            title: "Europe Launches Unified Film Incentive Program",
            summary: "EU announces streamlined tax credit system across member states, making cross-border productions 30% more efficient while promoting cultural exchange and local economies...",
            date: new Date().toISOString(),
            category: "location",
            source: "Screen International",
            sourceUrl: "https://screeninternational.com/eu-film-incentive-program",
            isFallback: true
        },
        {
            id: `fallback_loc_${Date.now()}_2`,
            title: "Smart Studio Facilities Transform Production Workflow",
            summary: "Next-generation facilities in Atlanta and Vancouver integrate IoT sensors and AI management systems, reducing setup times by 50% and enabling real-time production optimization...",
            date: new Date().toISOString(),
            category: "location",
            source: "Location Manager Magazine",
            sourceUrl: "https://locationmanager.com/smart-studio-facilities",
            isFallback: true
        }
    ];
}// Helper function to store news in Firestore
async function storeNews(type, newsItems) {
    const newsRef = firestore.collection('news').doc(type);

    await newsRef.set({
        items: newsItems,
        lastUpdated: new Date().toISOString(),
        type: type
    });

    console.log(`Stored ${newsItems.length} ${type} news items`);
}

// HTTP Cloud Function for refreshing news content
functions.http('refreshNews', async (req, res) => {
    try {
        console.log('Starting news refresh...');

        const geminiService = new GeminiNewsService();

        // Generate fresh production news
        let productionNews;
        try {
            productionNews = await geminiService.generateNewsSummaries('production', 3);
        } catch (error) {
            console.log('Gemini failed for production news, using NYC templates');
            productionNews = geminiService.generateTemplateNews('production', 3);
        }

        // Generate fresh location news  
        let locationNews;
        try {
            locationNews = await geminiService.generateNewsSummaries('location', 3);
        } catch (error) {
            console.log('Gemini failed for location news, using NYC templates');
            locationNews = geminiService.generateTemplateNews('location', 3);
        }

        // Store in Firestore
        await storeNews('production', productionNews);
        await storeNews('location', locationNews);

        console.log('✅ News refresh completed successfully');

        res.status(200).json({
            success: true,
            message: 'News content refreshed successfully',
            production: productionNews.length,
            location: locationNews.length
        });

    } catch (error) {
        console.error('❌ Error refreshing news:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});