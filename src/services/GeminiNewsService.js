// Gemini AI service for generating news summaries
class GeminiNewsService {
    constructor(apiKey, model = 'gemini-1.5-flash') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

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

Format your response as a JSON array with this exact structure:
[
  {
    "title": "Compelling headline here",
    "summary": "Detailed summary paragraph here...",
    "source": "Publication Name",
    "sourceUrl": "https://realistic-news-url.com/article-slug",
    "category": "${type}",
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

    parseGeminiResponse(text, type) {
        try {
            // Clean up the response text (remove markdown formatting if present)
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            const newsItems = JSON.parse(cleanText);

            // Validate and enhance the response
            return newsItems.map((item, index) => ({
                id: `gemini_${type}_${Date.now()}_${index}`,
                title: item.title,
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

    // Method to enhance existing news with AI summaries
    async enhanceNewsItem(originalItem) {
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

export default GeminiNewsService;
