// Enhanced Gemini News Service with Image Generation
// This service integrates AI image generation for news articles

class GeminiNewsImageService {
    constructor(apiKey, model = 'gemini-1.5-flash') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

        // Image generation endpoints
        this.imageEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage';
    }

    /**
     * Generate news with accompanying images
     */
    async generateNewsWithImages(type, count = 3) {
        try {
            // First generate the news content
            const newsItems = await this.generateNewsSummaries(type, count);

            // Then generate images for each news item
            const newsWithImages = await Promise.all(
                newsItems.map(async (item) => {
                    try {
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

            return newsWithImages;
        } catch (error) {
            console.error('Error generating news with images:', error);
            // Return news without images as fallback
            return await this.generateNewsSummaries(type, count);
        }
    }

    /**
     * Generate an image for a specific news item
     */
    async generateNewsImage(newsItem) {
        const imagePrompt = this.buildImagePrompt(newsItem);

        try {
            const response = await fetch(`${this.imageEndpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: imagePrompt,
                    numberOfImages: 1,
                    aspectRatio: '16:9', // Good for news article headers
                    negativePrompt: 'text, watermarks, logos, signatures, blurry, low quality',
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HATE_SPEECH',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        },
                        {
                            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`Image generation API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.images && data.images.length > 0) {
                return {
                    url: data.images[0].uri || data.images[0].bytesBase64Encoded,
                    altText: this.generateAltText(newsItem),
                    isGenerated: true,
                    prompt: imagePrompt
                };
            }

            throw new Error('No images returned from API');

        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    }

    /**
     * Build an image generation prompt based on news content
     */
    buildImagePrompt(newsItem) {
        const category = newsItem.category || 'production';

        if (category === 'production') {
            return this.buildProductionImagePrompt(newsItem);
        } else if (category === 'location') {
            return this.buildLocationImagePrompt(newsItem);
        }

        return this.buildGenericImagePrompt(newsItem);
    }

    buildProductionImagePrompt(newsItem) {
        const basePrompt = `Professional film industry scene, cinematic lighting, high quality, photorealistic`;

        // Extract key themes from the title and summary
        const text = `${newsItem.title} ${newsItem.summary}`.toLowerCase();

        if (text.includes('netflix') || text.includes('streaming')) {
            return `${basePrompt}, modern streaming production studio, high-tech filming equipment, LED screens, professional cameras, clean modern aesthetic, Netflix-style production environment`;
        }

        if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('virtual production')) {
            return `${basePrompt}, futuristic virtual production studio, LED volume walls, motion capture technology, digital filmmaking, cutting-edge technology, virtual sets`;
        }

        if (text.includes('independent') || text.includes('indie')) {
            return `${basePrompt}, independent film set, intimate production, creative filmmaking, artistic setup, smaller scale production, authentic atmosphere`;
        }

        if (text.includes('marvel') || text.includes('superhero') || text.includes('blockbuster')) {
            return `${basePrompt}, big budget film production, massive film set, action movie filming, superhero production, large crew, impressive staging`;
        }

        // Default production image
        return `${basePrompt}, professional film production set, movie cameras, director's equipment, film crew working, Hollywood-style production, behind the scenes`;
    }

    buildLocationImagePrompt(newsItem) {
        const basePrompt = `Beautiful filming location, cinematic composition, professional photography, high quality`;

        const text = `${newsItem.title} ${newsItem.summary}`.toLowerCase();

        if (text.includes('new york') || text.includes('nyc') || text.includes('manhattan') || text.includes('brooklyn')) {
            if (text.includes('high line')) {
                return `${basePrompt}, NYC High Line elevated park, urban greenery, steel architecture, city skyline, unique filming location`;
            }
            if (text.includes('washington square')) {
                return `${basePrompt}, Washington Square Park NYC, iconic arch, Greenwich Village, street performers, vibrant urban scene`;
            }
            if (text.includes('roosevelt island')) {
                return `${basePrompt}, Roosevelt Island Tramway, aerial view of Manhattan, cable cars, East River, unique transportation`;
            }
            return `${basePrompt}, iconic New York City location, urban landscape, filming-friendly environment, metropolitan atmosphere`;
        }

        if (text.includes('georgia') || text.includes('atlanta')) {
            return `${basePrompt}, Georgia filming location, Southern architecture, film-friendly state, production incentives environment`;
        }

        if (text.includes('vancouver') || text.includes('canada')) {
            return `${basePrompt}, Vancouver filming location, mountain backdrop, Pacific Northwest scenery, Canadian production hub`;
        }

        if (text.includes('london') || text.includes('uk') || text.includes('england')) {
            return `${basePrompt}, London filming location, British architecture, historic buildings, UK production setting`;
        }

        if (text.includes('studio') || text.includes('facility')) {
            return `${basePrompt}, modern film studio facility, soundstages, production infrastructure, professional filming environment`;
        }

        // Default location image
        return `${basePrompt}, scenic filming location, versatile backdrop, production-ready environment, cinematic landscape`;
    }

    buildGenericImagePrompt(newsItem) {
        return `Professional film industry scene, cinematic composition, high quality, related to: ${newsItem.title}`;
    }

    /**
     * Generate alt text for accessibility
     */
    generateAltText(newsItem) {
        const category = newsItem.category || 'news';
        return `Image related to ${category} news: ${newsItem.title}`;
    }

    /**
     * Get fallback image when generation fails
     */
    getFallbackImage(type, newsItem) {
        const fallbackImages = {
            production: [
                {
                    url: '/assets/production-fallback-1.jpg',
                    altText: 'Film production scene with cameras and crew',
                    isGenerated: false,
                    isFallback: true
                },
                {
                    url: '/assets/production-fallback-2.jpg',
                    altText: 'Movie studio with professional equipment',
                    isGenerated: false,
                    isFallback: true
                }
            ],
            location: [
                {
                    url: '/assets/location-fallback-1.jpg',
                    altText: 'Scenic filming location with urban backdrop',
                    isGenerated: false,
                    isFallback: true
                },
                {
                    url: '/assets/location-fallback-2.jpg',
                    altText: 'Professional filming location setup',
                    isGenerated: false,
                    isFallback: true
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

    /**
     * Enhanced news generation with smart image integration
     */
    async generateNewsSummaries(type, count = 3) {
        const prompt = this.buildPrompt(type, count);

        try {
            const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const generatedText = data.candidates[0].content.parts[0].text;

            return this.parseGeminiResponse(generatedText, type);

        } catch (error) {
            console.error('Error generating news with Gemini:', error);
            throw error;
        }
    }

    buildPrompt(type, count) {
        const typeContext = type === 'production'
            ? 'film and TV production, streaming platforms, studio announcements, casting news, production technology'
            : 'filming locations, studio facilities, film incentives, location services, international filming';

        return `
You are a film industry news expert. Generate ${count} realistic and current news summaries about ${typeContext}.

Requirements:
1. Each news item should be relevant to the film/TV industry in July 2025
2. Include realistic source publications (Variety, The Hollywood Reporter, Deadline, Entertainment Weekly, etc.)
3. Make summaries engaging but professional (50-80 words each)
4. Include realistic URLs that could exist for these stories
5. Focus on current industry trends like streaming, AI in filmmaking, sustainability, diversity initiatives
6. Make titles compelling and under 80 characters
7. Include visual elements that would make good imagery (locations, technology, people, events)
8. IMPORTANT: Do NOT include redundant prefixes in titles like "Latest Production:", "Trending Location:", "Production News:", "Location Update:", etc. Keep titles clean and direct.

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Compelling headline here",
    "summary": "Detailed summary paragraph here...",
    "date": "${new Date().toISOString()}",
    "category": "${type}",
    "source": "Publication Name",
    "sourceUrl": "https://realistic-news-url.com/article-slug",
    "relevanceScore": 95
  }
]

Topics to consider for ${type}:
${this.getTopicSuggestions(type)}

Generate current, realistic news that would actually appear in industry publications today.
`;
    }

    getTopicSuggestions(type) {
        if (type === 'production') {
            return `
- AI and virtual production technology
- Streaming platform content strategies
- Independent film funding and distribution
- Sustainable production practices
- International co-productions
- Voice acting and motion capture advances
- Post-production workflow innovations
- Diversity and inclusion initiatives
- Union negotiations and industry labor
- Box office trends and audience preferences`;
        } else {
            return `
- Film incentive programs and tax credits
- New studio facility developments
- International filming destinations
- Location scouting technology
- Permit and regulatory changes
- Infrastructure improvements for filming
- Cultural and heritage location protection
- COVID-related filming protocols evolution
- Remote and virtual location scouting
- Tourism impact of filming locations`;
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

            // Location-specific patterns
            /^(Location|Filming|Studio)\s+(News|Update|Spotlight|Alert):?\s*/i,
            /^(Latest|Trending|New)\s+(Location|Filming)\s+(News|Update)?:?\s*/i,

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
            // Clean up the response text (remove markdown formatting if present)
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const newsItems = JSON.parse(cleanText);

            // Validate and enhance the response
            return newsItems.map((item, index) => ({
                id: `gemini_${type}_${Date.now()}_${index}`,
                title: this.cleanArticleTitle(item.title, type),
                summary: item.summary,
                date: new Date().toISOString(),
                category: type,
                source: item.source || 'Industry News',
                sourceUrl: item.sourceUrl || this.generateFallbackUrl(item.title),
                relevanceScore: item.relevanceScore || 85,
                isGenerated: true,
                generatedAt: new Date().toISOString()
            }));

        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            throw new Error('Failed to parse AI-generated news content');
        }
    }

    generateFallbackUrl(title) {
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);

        const sources = [
            'variety.com',
            'hollywoodreporter.com',
            'deadline.com',
            'entertainmentweekly.com'
        ];

        const randomSource = sources[Math.floor(Math.random() * sources.length)];
        return `https://${randomSource}/${slug}`;
    }

    /**
     * Method to enhance existing news with AI summaries and images
     */
    async enhanceNewsItem(originalItem) {
        try {
            // Enhance the text content
            const enhancedItem = await this.enhanceNewsText(originalItem);

            // Add an image
            const imageData = await this.generateNewsImage(enhancedItem);

            return {
                ...enhancedItem,
                image: imageData
            };
        } catch (error) {
            console.error('Error enhancing news item:', error);
            return {
                ...originalItem,
                image: this.getFallbackImage(originalItem.category || 'production', originalItem)
            };
        }
    }

    async enhanceNewsText(originalItem) {
        const enhancementPrompt = `
Enhance this film industry news item with a more engaging summary while keeping the core facts:

Original Title: ${originalItem.title}
Original Summary: ${originalItem.summary}
Source: ${originalItem.source}

Requirements:
1. Keep the same factual content
2. Make the summary more engaging and industry-focused
3. Ensure it's 50-80 words
4. Maintain professional tone suitable for film industry professionals
5. Include visual elements that would make for compelling imagery

Return only the enhanced summary text, no additional formatting.
`;

        try {
            const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: enhancementPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 200,
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                const enhancedSummary = data.candidates[0].content.parts[0].text.trim();

                return {
                    ...originalItem,
                    summary: enhancedSummary,
                    isEnhanced: true,
                    enhancedAt: new Date().toISOString()
                };
            }

            return originalItem; // Return original if enhancement fails

        } catch (error) {
            console.error('Error enhancing news item:', error);
            return originalItem;
        }
    }
}

export default GeminiNewsImageService;
