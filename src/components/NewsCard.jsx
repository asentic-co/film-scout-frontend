// Pure presentation component for news cards
import React from 'react';
import '../CardsNews/NewsCards.css';

const NewsCard = ({
    title,
    type,
    newsItem,
    loading,
    error,
    isOnline,
    onRefresh,
    className = '',
    tag = null // New prop for tag instead of title
}) => {
    const cardClass = `card ${type}-card ${className}`.trim();

    if (loading) {
        return (
            <div className={cardClass}>
                {tag && (
                    <div className="news-tag-container">
                        <span className="news-tag">{tag}</span>
                    </div>
                )}
                {title && !tag && <h3>{title}</h3>}
                <div className="news-loading">
                    <div className="loading-spinner" />
                    <p className="loading">Loading latest {type} news...</p>
                </div>
            </div>
        );
    }

    if (error && !newsItem) {
        return (
            <div className={cardClass}>
                {tag && (
                    <div className="news-tag-container">
                        <span className="news-tag">{tag}</span>
                    </div>
                )}
                {title && !tag && <h3>{title}</h3>}
                <div className="news-error">
                    <p className="error">
                        {isOnline ? 'Unable to load news.' : 'You are offline.'}
                    </p>
                    {onRefresh && (
                        <button onClick={onRefresh} className="retry-button">
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className={cardClass}>
                {tag && (
                    <div className="news-tag-container">
                        <span className="news-tag">{tag}</span>
                    </div>
                )}
                {title && !tag && <h3>{title}</h3>}
                <p className="no-news">No {type} news available at this time.</p>
            </div>
        );
    }

    // Debug logging to see what data we're getting
    //console.log(`NewsCard [${type}]:`, {
     //   title: newsItem?.title,
     //   hasImage: !!newsItem?.image,
     //   imageUrl: newsItem?.image?.url,
    //    newsItem: newsItem
    //});

    return (
        <div className={cardClass}>
            {tag && (
                <div className="news-tag-container">
                    <span className="news-tag">{tag}</span>
                </div>
            )}
            {title && !tag && <h3>{title}</h3>}
            {newsItem.image && (
                <div className="news-image-container">
                    <img
                        src={newsItem.image.url}
                        alt={newsItem.image.altText}
                        className="news-image"
                        loading="lazy"
                        onError={(e) => {
                            // Hide image if it fails to load
                            e.target.style.display = 'none';
                        }}
                    />
                    {newsItem.image.isGenerated && (
                        <span className="image-ai-indicator" title="AI Generated Image">🎨</span>
                    )}
                </div>
            )}
            <div className="news-content">
                <h4 className="news-title">{newsItem.title}</h4>
                <p className="news-summary">{newsItem.summary}</p>
                <div className="news-meta">
                    <span className="news-date">
                        {new Date(newsItem.date).toLocaleDateString()}
                    </span>
                    {newsItem.source && (
                        <span className="news-source">• {newsItem.source}</span>
                    )}
                    {newsItem.isFallback && (
                        <span className="fallback-indicator" title="Cached content">📦</span>
                    )}
                    {newsItem.isGenerated && (
                        <span className="ai-indicator" title="AI Generated">🤖</span>
                    )}
                </div>
                {newsItem.sourceUrl && (
                    <div className="news-actions">
                        <a
                            href={newsItem.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="read-more-link"
                            onClick={(e) => {
                                // Prevent navigation for fallback URLs that don't exist
                                if (newsItem.isFallback || newsItem.isGenerated) {
                                    e.preventDefault();
                                    alert('This is sample content - full article not available');
                                }
                            }}
                        >
                            Read Full Article →
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsCard;
