import { useState, useEffect, useCallback } from 'react';
import { useNewsContext } from '../context/NewsContext';

export const useNews = (type, limit = 3) => {
    const { data, loading, errors, fetchNews, isOnline } = useNewsContext();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const key = `${type}-${limit}`;
    const newsData = data[key] || [];
    const isLoading = loading[key] || false;
    const error = errors[key] || null;

    // Fetch news data
    const loadNews = useCallback(async () => {
        try {
            await fetchNews(type, limit);
        } catch (err) {
            console.warn('Failed to load news:', err.message);
        }
    }, [fetchNews, type, limit]);

    // Refresh function for manual refresh
    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await loadNews();
        } finally {
            setIsRefreshing(false);
        }
    }, [loadNews]);

    // Load news on mount or when parameters change
    useEffect(() => {
        if (newsData.length === 0 && !isLoading && !error) {
            loadNews();
        }
    }, [type, limit, newsData.length, isLoading, error, loadNews]);

    return {
        news: newsData,
        loading: isLoading,
        error,
        isRefreshing,
        isOnline,
        refresh,
        isEmpty: !isLoading && newsData.length === 0,
        hasData: newsData.length > 0
    };
};
