// Centralized API configuration utility
// This will handle different environments (local dev, Docker, production)

const getApiBaseUrl = () => {
    // First try to get from Vite environment variable (recommended approach)
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }

    // Use different URLs based on environment
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
        // Local development - use localhost directly, no /api prefix
        return "http://localhost:4000";
    } else {
        // Production - use backend subdomain, no /api prefix
        return "https://api.filmscout.app";
    }
};

const getNewsApiBaseUrl = () => {
    // Use dedicated News API environment variable
    return import.meta.env.VITE_NEWS_API_URL || 'https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews';
};

// Export individual API endpoints for main service (App/Dashboard)
export const API_ENDPOINTS = {
    HEALTH: `${getApiBaseUrl()}/health`,
    EVENTS: `${getApiBaseUrl()}/events`,
    INFER_PRODUCTION: `${getApiBaseUrl()}/infer-production`,
    INFER_ACTORS: `${getApiBaseUrl()}/infer-actors`,
    INFER_UNKNOWN: `${getApiBaseUrl()}/infer-unknown`,
    ACTOR_IMAGE: `${getApiBaseUrl()}/actor-image`,
    COMPANY_LOGO: `${getApiBaseUrl()}/infer-company-logo`,
    PRODUCTION_TEASER: `${getApiBaseUrl()}/production-teaser`,
    SUGGESTED_NEIGHBORHOODS: `${getApiBaseUrl()}/suggested-neighborhoods`,
    NEWS_IMAGES: `${getApiBaseUrl()}/news-images`,
    CURATED_IMAGES: `${getApiBaseUrl()}/curated-images`,
};

// Export individual News API endpoints for News page
export const NEWS_API_ENDPOINTS = {
    PRODUCTION_NEWS: `${getNewsApiBaseUrl()}?type=production`,
    LOCATION_NEWS: `${getNewsApiBaseUrl()}?type=location`,
    ALL_NEWS: getNewsApiBaseUrl(),
};

// Export the base URL functions for custom endpoints
export { getApiBaseUrl, getNewsApiBaseUrl };

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
