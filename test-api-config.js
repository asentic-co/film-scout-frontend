// Test script to verify API configuration
import { API_ENDPOINTS, NEWS_API_ENDPOINTS, getApiBaseUrl, getNewsApiBaseUrl } from './src/utils/apiConfig.js';

console.log('=== API Configuration Test ===');
console.log('Main API Base URL:', getApiBaseUrl());
console.log('News API Base URL:', getNewsApiBaseUrl());
console.log('');
console.log('Environment variables:');
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- VITE_NEWS_API_URL:', import.meta.env.VITE_NEWS_API_URL);
console.log('- VITE_ENVIRONMENT:', import.meta.env.VITE_ENVIRONMENT);
console.log('- Hostname:', window.location.hostname);
console.log('');
console.log('Main API Endpoints:');
Object.entries(API_ENDPOINTS).forEach(([key, url]) => {
    console.log(`- ${key}: ${url}`);
});
console.log('');
console.log('News API Endpoints:');
Object.entries(NEWS_API_ENDPOINTS).forEach(([key, url]) => {
    console.log(`- ${key}: ${url}`);
});
