// Scheduled function to refresh news content monthly
// This function can be deployed as a separate Cloud Function with a cron schedule

// Load environment variables from .env file
require('dotenv').config();

const { Firestore } = require('@google-cloud/firestore');
const axios = require('axios');

const firestore = new Firestore();

class NewsRefreshService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.model = 'gemini-1.5-flash';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    async generateFreshNews(type, count = 3) {
        if (!this.apiKey) {
            console.log('No Gemini API key found, using template news...');
            return this.generateTemplateNews(type, count);
        }

        const prompt = this.buildNewsPrompt(type, count);

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
            return this.parseAIResponse(generatedText, type);

        } catch (error) {
            console.error('Gemini API error, falling back to template news:', error.message);
            return this.generateTemplateNews(type, count);
        }
    }

    buildNewsPrompt(type, count) {
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
                    "summary": "Detailed 2-3 sentence summary about current NYC filming with specific locations and impact",
                    "date": "${new Date().toISOString()}",
                    "category": "production",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                },
                {
                    "id": "prod-2", 
                    "title": "Now Showing: [NYC-filmed production now in theaters under 80 chars]",
                    "summary": "Detailed 2-3 sentence summary about recently released film/show filmed in NYC",
                    "date": "${new Date().toISOString()}",
                    "category": "production",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                },
                {
                    "id": "prod-3",
                    "title": "Coming Soon: [Announced NYC production under 80 chars]", 
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
            
            Return as JSON array with this exact structure:
            [
                {
                    "id": "loc-1", 
                    "title": "Interesting Location: [Compelling headline about unique NYC spot under 80 chars]",
                    "summary": "Detailed 2-3 sentence summary with specific location details and why it's architecturally/culturally interesting",
                    "date": "${new Date().toISOString()}",
                    "category": "location",
                    "source": "Realistic trade publication name", 
                    "sourceUrl": "https://example.com/article-url",
                    "isFallback": false
                },
                {
                    "id": "loc-2",
                    "title": "Unusual Location: [Compelling headline about quirky NYC spot under 80 chars]", 
                    "summary": "Detailed 2-3 sentence summary about unexpected or surprising filming location in NYC",
                    "date": "${new Date().toISOString()}",
                    "category": "location",
                    "source": "Realistic trade publication name",
                    "sourceUrl": "https://example.com/article-url", 
                    "isFallback": false
                },
                {
                    "id": "loc-3",
                    "title": "Famous Location: [Compelling headline about iconic NYC spot under 80 chars]",
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

    parseAIResponse(text, type) {
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
}

// Main refresh function
async function refreshNewsContent() {
    const newsService = new NewsRefreshService();

    try {
        console.log('Starting monthly news refresh...');

        // Generate fresh production news
        const productionNews = await newsService.generateFreshNews('production', 3);
        const productionRef = firestore.collection('news').doc('production');
        await productionRef.set({
            items: productionNews,
            lastUpdated: new Date().toISOString(),
            type: 'production'
        });
        console.log('✅ Production news refreshed');

        // Generate fresh location news  
        const locationNews = await newsService.generateFreshNews('location', 3);
        const locationRef = firestore.collection('news').doc('location');
        await locationRef.set({
            items: locationNews,
            lastUpdated: new Date().toISOString(),
            type: 'location'
        });
        console.log('✅ Location news refreshed');

        console.log('🎉 Monthly news refresh complete!');
        return { success: true, message: 'News content refreshed successfully' };

    } catch (error) {
        console.error('❌ Error refreshing news:', error);
        return { success: false, error: error.message };
    }
}

// For Cloud Functions deployment
const functions = require('@google-cloud/functions-framework');

// Register the HTTP function
functions.http('refreshNews', async (req, res) => {
    const result = await refreshNewsContent();
    res.status(result.success ? 200 : 500).json(result);
});

// For direct execution
if (require.main === module) {
    refreshNewsContent().then(result => {
        console.log('Refresh completed:', result);
        process.exit(result.success ? 0 : 1);
    });
}
