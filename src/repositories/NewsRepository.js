// News data access layer - handles all API interactions
class NewsRepository {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async getNews(type, limit = 3) {
        const cacheKey = `${type}-${limit}`;
        const cached = this.cache.get(cacheKey);

        // Return cached data if still fresh
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const data = await this.apiClient.fetchNews(type, limit);
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            // Return cached data if available, even if stale
            if (cached) {
                console.warn('Using stale cache due to API error:', error);
                return cached.data;
            }
            throw error;
        }
    }

    clearCache() {
        this.cache.clear();
    }

    getCacheStatus(type, limit = 3) {
        const cacheKey = `${type}-${limit}`;
        const cached = this.cache.get(cacheKey);
        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        return {
            isStale: age > this.cacheTimeout,
            age,
            lastUpdated: new Date(cached.timestamp)
        };
    }
}

export default NewsRepository;
