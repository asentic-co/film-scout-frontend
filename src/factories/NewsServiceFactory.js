// News service factory - dependency injection and configuration
import NewsApiClient from '../api/NewsApiClient';
import NewsRepository from '../repositories/NewsRepository';
import FallbackDataProvider from '../providers/FallbackDataProvider';

class NewsServiceFactory {
    static create(config = {}) {
        const {
            baseUrl = 'https://news.filmscout.app/api',
            enableCache = true,
            cacheTimeout = 5 * 60 * 1000,
        } = config;

        const fallbackProvider = new FallbackDataProvider();
        const apiClient = new NewsApiClient(baseUrl, fallbackProvider);
        const repository = new NewsRepository(apiClient);

        if (!enableCache) {
            // Return a direct API client wrapper if caching is disabled
            return {
                async getNews(type, limit) {
                    return apiClient.fetchNews(type, limit);
                }
            };
        }

        // Configure cache timeout if provided
        if (cacheTimeout !== 5 * 60 * 1000) {
            repository.cacheTimeout = cacheTimeout;
        }

        return repository;
    }

    // Create service with different configurations for different environments
    static createForProduction() {
        return this.create({
            // Let deployment-time configuration provide the actual URL. Use a generic origin-relative default.
            baseUrl: typeof window !== 'undefined' ? `${window.location.origin}/getNews` : 'https://your-production-getnews.example/getNews',
            enableCache: true,
            cacheTimeout: 10 * 60 * 1000, // 10 minutes for production
        });
    }

    static createForDevelopment() {
        return this.create({
            baseUrl: 'http://localhost:8080',
            enableCache: true,
            cacheTimeout: 1 * 60 * 1000, // 1 minute for development
        });
    }

    static createForTesting() {
        return this.create({
            baseUrl: 'http://localhost:3001/mock-api',
            enableCache: false, // No caching in tests
        });
    }
}

export default NewsServiceFactory;
