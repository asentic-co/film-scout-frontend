import React, { createContext, useState, useEffect, useContext } from 'react';

export const NewsContext = createContext();
export const useNewsContext = () => useContext(NewsContext);

export function NewsProvider({ children, preloadedNews, preloadedImages, preloadingComplete }) {
  const [newsRaw, setNewsRaw] = useState(preloadedNews);
  const [newsLoading, setNewsLoading] = useState(!preloadingComplete);
  const [images, setImages] = useState(preloadedImages);

  // Update state when preloaded data arrives
  useEffect(() => {
    if (preloadingComplete && preloadedNews) {
      setNewsRaw(preloadedNews);
      setNewsLoading(false);
    }
    if (preloadingComplete && preloadedImages) {
      setImages(preloadedImages);
    }
  }, [preloadedNews, preloadedImages, preloadingComplete]);

  // Fallback: Fetch news if not preloaded (shouldn't happen in normal flow)
  useEffect(() => {
    // Only fetch if we don't have preloaded data and preloading is complete but failed
    if (preloadingComplete && !newsRaw) {
      console.log('[NewsContext] Fallback: fetching news data');
      setNewsLoading(true);
      Promise.all([
        fetch("https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews?type=production&limit=3")
          .then(res => res.json()),
        fetch("https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews?type=location&limit=3")
          .then(res => res.json())
      ])
        .then(([productionData, locationData]) => {
          // Normalize to arrays if needed
          const production = Array.isArray(productionData) ? productionData : (productionData.articles || []);
          const location = Array.isArray(locationData) ? locationData : (locationData.articles || []);
          setNewsRaw({ production, location, articles: [...production, ...location] });
          setNewsLoading(false);
        })
        .catch((err) => {
          console.error('[NewsContext] Fallback fetch error:', err);
          setNewsRaw({ error: 'Network error' });
          setNewsLoading(false);
        });
    }
  }, [preloadingComplete, newsRaw]);

  // Transform newsRaw into production and location arrays
  const news = React.useMemo(() => {
    if (!newsRaw) {
      console.log('[NewsContext] newsRaw is null or undefined');
      return null;
    }
    // Handle error objects from API
    if (newsRaw.error) {
      console.error('[NewsContext] API returned error:', newsRaw.error);
      return { production: [], location: [], articles: [], error: newsRaw.error };
    }
    console.log('[NewsContext] newsRaw:', newsRaw);
    // If newsRaw is an object with articles array
    if (Array.isArray(newsRaw.articles)) {
      const result = {
        production: newsRaw.articles.filter(a => a.category === 'production'),
        location: newsRaw.articles.filter(a => a.category === 'location'),
        articles: newsRaw.articles,
      };
      console.log('[NewsContext] transformed news:', result);
      return result;
    }
    // If newsRaw is an array
    if (Array.isArray(newsRaw)) {
      const result = {
        production: newsRaw.filter(a => a.category === 'production'),
        location: newsRaw.filter(a => a.category === 'location'),
        articles: newsRaw,
      };
      console.log('[NewsContext] transformed news:', result);
      return result;
    }
    // If newsRaw already has production/location keys
    if (newsRaw.production && newsRaw.location) {
      console.log('[NewsContext] using raw production/location:', newsRaw);
      return newsRaw;
    }
    console.log('[NewsContext] fallback empty news');
    return { production: [], location: [], articles: [] };
  }, [newsRaw]);

  return (
    <NewsContext.Provider value={{
      news,
      setNews: setNewsRaw,
      newsLoading,
      setNewsLoading,
      images,
      setImages,
      preloadingComplete
    }}>
      {children}
    </NewsContext.Provider>
  );
}
