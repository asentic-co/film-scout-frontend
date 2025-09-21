import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { NewsProvider } from "./context/NewsContext.jsx";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import News from "./News";
import About from "./About";
import NewsImages from "./NewsImages";
import NewsImageTest from "./components/NewsImageTest";
import ImageReview from "./components/ImageReview";
import PreloadingIndicator from "./components/PreloadingIndicator";
import curatedNewsImageClient from "./utils/curatedNewsImageClient";
import { preloadImageObjects } from "./utils/imagePreloader";
import './App.css';

const backendTarget = import.meta.env.VITE_API_URL;

console.log("VITE_API_URL:", backendTarget, "| type:", typeof backendTarget);

export default function App() {
  // Determine environment
  const environment = import.meta.env.NODE_ENV === 'development' ? 'development' : 'production';

  // Pre-load news data and images
  const [preloadedNews, setPreloadedNews] = useState(null);
  const [preloadedImages, setPreloadedImages] = useState(null);
  const [preloadingComplete, setPreloadingComplete] = useState(false);

  useEffect(() => {
    // Start pre-loading immediately when app mounts
    const preloadContent = async () => {
      try {
        console.log('[App] Starting content pre-loading...');

        // Pre-load news data
        const [productionData, locationData] = await Promise.all([
          fetch("https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews?type=production&limit=3")
            .then(res => res.json()),
          fetch("https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews?type=location&limit=3")
            .then(res => res.json())
        ]);

        // Normalize to arrays if needed
        const production = Array.isArray(productionData) ? productionData : (productionData.articles || []);
        const location = Array.isArray(locationData) ? locationData : (locationData.articles || []);
        const newsData = { production, location, articles: [...production, ...location] };

        // Pre-load curated images
        const images = await curatedNewsImageClient.fetchUniqueRandomCuratedImages(6);

        // Pre-load actual images to browser cache
        await preloadImageObjects(images);

        setPreloadedNews(newsData);
        setPreloadedImages(images);
        setPreloadingComplete(true);

        console.log('[App] Content pre-loading complete:', { newsData, images });
      } catch (error) {
        console.error('[App] Pre-loading error:', error);
        // Set fallback data so the app still works
        setPreloadedNews({ production: [], location: [], articles: [], error: 'Pre-load failed' });
        setPreloadedImages(Array(6).fill({ url: null, alt: 'Image unavailable', error: 'Failed to load' }));
        setPreloadingComplete(true);
      }
    };

    preloadContent();
  }, []);

  return (
    <NewsProvider
      environment={environment}
      preloadedNews={preloadedNews}
      preloadedImages={preloadedImages}
      preloadingComplete={preloadingComplete}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/newsImages" element={<NewsImages />} />
          <Route path="/test-images" element={<NewsImageTest />} />
          <Route path="/image-review" element={<ImageReview />} />
        </Routes>
        <PreloadingIndicator isPreloading={!preloadingComplete} />
      </Router>
    </NewsProvider>
  );
}