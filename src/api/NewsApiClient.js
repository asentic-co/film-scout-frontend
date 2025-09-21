// API client - pure HTTP layer
class NewsApiClient {
    constructor(baseUrl, fallbackData) {
        this.baseUrl = baseUrl;
        this.fallbackData = fallbackData;
    }

    async fetchNews(type, limit = 3) {
        if (!['production', 'location'].includes(type)) {
            throw new Error(`Invalid news type: ${type}`);
        }

        try {
            const response = await fetch(`${this.baseUrl}?type=${type}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Add timeout
                signal: AbortSignal.timeout(10000), // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];

        } catch (error) {
            console.warn(`News API error for ${type}:`, error.message);

            // Return fallback data
            return this.fallbackData.getFallbackNews(type, limit);
        }
    }
}

export default NewsApiClient;
