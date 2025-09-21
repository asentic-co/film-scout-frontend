import './App.css';
import './News.css';
import React, { useState, useEffect } from 'react';
import { useNewsContext } from "./context/NewsContext.jsx";

import Production1Card from "./CardsNews/Production1Card";
import Production2Card from "./CardsNews/Production2Card";
import Production3Card from "./CardsNews/Production3Card";
import Location1Card from "./CardsNews/Location1Card";
import Location2Card from "./CardsNews/Location2Card";
import Location3Card from "./CardsNews/Location3Card";
import curatedNewsImageClient from "./utils/curatedNewsImageClient";

export default function News() {
  const { news, newsLoading, images, preloadingComplete } = useNewsContext();
  const [shuffledCards, setShuffledCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define all cards with their components and types
  const allCards = [
    { type: 'production', id: 'prod1', component: Production1Card },
    { type: 'production', id: 'prod2', component: Production2Card },
    { type: 'production', id: 'prod3', component: Production3Card },
    { type: 'location', id: 'loc1', component: Location1Card },
    { type: 'location', id: 'loc2', component: Location2Card },
    { type: 'location', id: 'loc3', component: Location3Card },
  ];

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Shuffle cards on mount and handle loading state
  useEffect(() => {
    const shuffled = shuffleArray(allCards);
    setShuffledCards(shuffled);

    // Set loading to false when preloading is complete and we have images
    if (preloadingComplete && images) {
      setLoading(false);
    } else if (preloadingComplete && !images) {
      // Fallback: fetch images if preloading failed
      console.log('[News] Fallback: fetching curated images');
      curatedNewsImageClient.fetchUniqueRandomCuratedImages(6)
        .then(results => {
          // This will be handled by the context now
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching unique curated images:', error);
          setLoading(false);
        });
    }
  }, [preloadingComplete, images]);

  // Use preloaded images or fallback
  const displayImages = images || Array(6).fill({ url: null, alt: 'Image unavailable', error: 'Failed to load' });

  // Split shuffled cards into two rows of 3
  const firstRow = shuffledCards.slice(0, 3);
  const secondRow = shuffledCards.slice(3, 6);

  if (loading || newsLoading) {
    return (
      <div className="page-container news-page">
        <div className="news-loading-container">
          <div className="news-loading-spinner"></div>
          <div className="news-loading-text">
            <span className="gathering-text">Gathering news</span>
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container news-page">
      {/* First Row - Mixed Cards */}
      <section>
        <div className="grid-row">
          {firstRow.map((card, idx) => {
            const CardComponent = card.component;
            return <CardComponent key={card.id} image={displayImages[idx]} />;
          })}
        </div>
      </section>

      {/* Second Row - Mixed Cards */}
      <section>
        <div className="grid-row">
          {secondRow.map((card, idx) => {
            const CardComponent = card.component;
            return <CardComponent key={card.id} image={displayImages[idx + 3]} />;
          })}
        </div>
      </section>
    </div>
  );
}
