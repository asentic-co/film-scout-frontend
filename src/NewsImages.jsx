import React from 'react';
import newsImageLinks from './newsImageLinks.js';
import './NewsImages.css';

const NewsImages = () => {
    return (
        <div className="news-images-container">
            <h1>NYC Filming Location Images Preview</h1>
                 <div className="category-summary">
                <div className="category-stats">
                    <span className="stat-item">📍 Manhattan: 10 images</span>
                    <span className="stat-item">🌉 Brooklyn: 8 images</span>
                    <span className="stat-item">🚇 Transportation: 5 images</span>
                    <span className="stat-item">🏛️ Cultural: 4 images</span>
                    <span className="stat-item">🗽 Outer Boroughs: 3 images</span>
                </div>
            </div>            <div className="images-grid">
                {newsImageLinks.map((image, index) => (
                    <div key={index} className="image-card">
                        <img
                            src={image.url}
                            alt={image.altText}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                            }}
                        />
                        <div className="image-info">
                            <h3>{image.filename}</h3>
                            <p className="alt-text">{image.altText}</p>
                            <p className="source">{image.source}</p>
                            <div className="tags">
                                {image.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="header-section">
                <h1>NYC Filming Locations - Image Testing</h1>
                <p className="description">
                    EXPANDED COLLECTION: Now testing 60 Unsplash images for NYC filming locations.
                    This page helps identify which URLs are working so you can create a verified list
                    for the News page. Images that show "Image Not Found" indicate broken Unsplash URLs
                    that need to be replaced.
                </p>
                <div className="summary-stats">
                    <span className="stat">📍 60 Locations</span>
                    <span className="stat">🏙️ 5 Categories</span>
                    <span className="stat">🔍 Testing Status</span>
                </div>
            </div>
        </div>
    );
};

export default NewsImages;
